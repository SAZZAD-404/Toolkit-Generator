import { useState } from 'react';
import { Copy, Smartphone, Download } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './Card';
import { Button } from './Button';
import { Select } from './Select';
import { generateUserAgents, availableCountries } from '../utils/userAgentGenerator';
import { saveGeneratedData, getExistingDataValues } from '../utils/dataStorage';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';
import DuplicateStatus from './DuplicateStatus';

export default function UserAgentGenerator() {
  const [device, setDevice] = useState('android');
  const [browser, setBrowser] = useState('facebook');
  const [version, setVersion] = useState('mix');
  const [count, setCount] = useState(5);
  const [country, setCountry] = useState('usa');
  const [results, setResults] = useState([]);
  const [resultDevices, setResultDevices] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [androidPercent, setAndroidPercent] = useState(60);
  const iosPercent = 100 - androidPercent;
  const { addGeneratedData } = useAppData();
  const { addToast } = useToast();

  const handleGenerate = async () => {
    const startTime = performance.now(); // Track generation start time
    setIsLoading(true);
    try {
      console.log('Generating user agents:', { device, browser, version, count, country });
      
      // Get existing user agents for this user
      const existingUserAgents = user ? await getExistingDataValues('user_agent') : [];
      
      let uniqueResults = [];
      let uniqueDevices = [];
      let attempts = 0;
      const maxAttempts = count * 10; // Try 10 times more than needed

      while (uniqueResults.length < count && attempts < maxAttempts) {
        let generatedResults = [];
        let generatedDevices = [];

        if (device === 'mix') {
          const androidCount = Math.round((count - uniqueResults.length) * (androidPercent / 100));
          const iosCount = (count - uniqueResults.length) - androidCount;

          let androidUAs, iosUAs;
          if (version === 'mix') {
            androidUAs = [];
            for (let i = 0; i < androidCount; i++) {
              const randomVersion = ['latest', 'recent', 'old'][Math.floor(Math.random() * 3)];
              androidUAs.push(...generateUserAgents('android', browser, randomVersion, 1, country));
            }
            iosUAs = [];
            for (let i = 0; i < iosCount; i++) {
              const randomVersion = ['latest', 'recent', 'old'][Math.floor(Math.random() * 3)];
              iosUAs.push(...generateUserAgents('iphone', browser, randomVersion, 1, country));
            }
          } else {
            androidUAs = generateUserAgents('android', browser, version, androidCount, country);
            iosUAs = generateUserAgents('iphone', browser, version, iosCount, country);
          }

          const combined = [...androidUAs.map((ua) => ({ ua, device: 'android' })),
          ...iosUAs.map((ua) => ({ ua, device: 'iphone' }))];
          const shuffled = combined.sort(() => Math.random() - 0.5);

          generatedResults = shuffled.map(item => item.ua);
          generatedDevices = shuffled.map(item => item.device);
        } else {
          let generated;
          if (version === 'mix') {
            generated = [];
            for (let i = 0; i < (count - uniqueResults.length); i++) {
              const randomVersion = ['latest', 'recent', 'old'][Math.floor(Math.random() * 3)];
              generated.push(...generateUserAgents(device, browser, randomVersion, 1, country));
            }
          } else {
            generated = generateUserAgents(device, browser, version, count - uniqueResults.length, country);
          }
          
          generatedResults = generated;
          generatedDevices = Array(count - uniqueResults.length).fill(device);
        }

        // Filter out duplicates
        for (let i = 0; i < generatedResults.length; i++) {
          const ua = generatedResults[i];
          if (!existingUserAgents.includes(ua) && !uniqueResults.includes(ua)) {
            uniqueResults.push(ua);
            uniqueDevices.push(generatedDevices[i]);
            if (uniqueResults.length >= count) break;
          }
        }
        
        attempts++;
      }

      // Take only what we need
      uniqueResults = uniqueResults.slice(0, count);
      uniqueDevices = uniqueDevices.slice(0, count);

      setResults(uniqueResults);
      setResultDevices(uniqueDevices);
      
      // Calculate and emit generation time
      const endTime = performance.now();
      const generationTime = (endTime - startTime) / 1000; // Convert to seconds
      
      // Emit generation complete event with timing
      window.dispatchEvent(new CustomEvent('generationComplete', {
        detail: { generationTime, type: 'user_agent', count: uniqueResults.length }
      }));
      
      if (uniqueResults.length > 0) {
        addToast(`${uniqueResults.length} unique user agents generated!`, 'success');

        // Save to database if user is logged in
        if (user) {
          try {
            for (let i = 0; i < uniqueResults.length; i++) {
              await saveGeneratedData('user_agent', uniqueResults[i], {
                device: uniqueDevices[i] || device,
                browser: browser,
                version: version,
                country: country
              }, addGeneratedData);
            }
          } catch (error) {
            console.error('Error saving generated data:', error);
          }
        }
      } else {
        addToast('No new unique user agents could be generated. Try different settings.', 'warning');
      }
    } catch (error) {
      console.error('Error generating user agents:', error);
      addToast('Error generating user agents: ' + error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(results.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast(`${results.length} user agents copied!`, 'success');
  };

  const handleCopyIndividual = (ua, index) => {
    navigator.clipboard.writeText(ua);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    addToast('User agent copied!', 'success');
  };

  const handleClear = () => {
    setResults([]);
    setResultDevices([]);
    addToast('Results cleared', 'info');
  };

  const handleExport = (format) => {
    let content = '';
    let filename = '';
    let mimeType = '';

    if (format === 'txt') {
      content = results.join('\n');
      filename = `user-agents-${Date.now()}.txt`;
      mimeType = 'text/plain';
    } else if (format === 'csv') {
      content = 'Index,User Agent,Device,Browser\n';
      content += results.map((ua, index) =>
        `${index + 1},"${ua}","${resultDevices[index] || device}","${browser}"`
      ).join('\n');
      filename = `user-agents-${Date.now()}.csv`;
      mimeType = 'text/csv';
    } else if (format === 'json') {
      const jsonData = results.map((ua, index) => ({
        index: index + 1,
        userAgent: ua,
        device: resultDevices[index] || device,
        browser: browser,
        version: version
      }));
      content = JSON.stringify(jsonData, null, 2);
      filename = `user-agents-${Date.now()}.json`;
      mimeType = 'application/json';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
      <div className="p-4 md:p-6 space-y-6">
        {/* Modern Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 backdrop-blur-xl rounded-3xl border border-blue-500/20 p-6 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-purple-600/5"></div>
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Smartphone size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  User Agent Generator
                </h1>
                <p className="text-slate-400 mt-1">Generate real, valid user agents for Android & iPhone</p>
              </div>
            </div>
            {results.length > 0 && (
              <div className="text-center sm:text-right">
                <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  {results.length}
                </div>
                <div className="text-sm text-slate-400">Generated</div>
              </div>
            )}
          </div>
        </div>

        {/* Duplicate Prevention Status */}
        <DuplicateStatus dataType="user_agent" />

        <Card className="w-full flex flex-col shadow-2xl bg-slate-800/50 backdrop-blur-xl border-slate-700/50">
          <CardContent className="p-6">
            <div className="space-y-8">
              {/* Device Selection - Modern Cards */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    Device Platform
                  </h3>
                  <span className="text-xs text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                    {device === 'android' ? '📱 Android' : device === 'iphone' ? '🍎 iOS' : `🔀 Mix (${androidPercent}% Android, ${iosPercent}% iOS)`}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setDevice('android')}
                    className={`relative overflow-hidden p-4 rounded-xl border transition-all duration-300 group ${
                      device === 'android'
                        ? 'bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/50 shadow-lg shadow-green-500/25'
                        : 'bg-slate-800/50 border-slate-600/50 hover:border-green-500/30 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="text-2xl mb-2">📱</div>
                    <div className="text-sm font-medium text-slate-200">Android</div>
                    {device === 'android' && (
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent animate-shimmer"></div>
                    )}
                  </button>
                  <button
                    onClick={() => setDevice('iphone')}
                    className={`relative overflow-hidden p-4 rounded-xl border transition-all duration-300 group ${
                      device === 'iphone'
                        ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/50 shadow-lg shadow-blue-500/25'
                        : 'bg-slate-800/50 border-slate-600/50 hover:border-blue-500/30 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="text-2xl mb-2">🍎</div>
                    <div className="text-sm font-medium text-slate-200">iPhone</div>
                    {device === 'iphone' && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent animate-shimmer"></div>
                    )}
                  </button>
                  <button
                    onClick={() => setDevice('mix')}
                    className={`relative overflow-hidden p-4 rounded-xl border transition-all duration-300 group ${
                      device === 'mix'
                        ? 'bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/50 shadow-lg shadow-purple-500/25'
                        : 'bg-slate-800/50 border-slate-600/50 hover:border-purple-500/30 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="text-2xl mb-2">🔀</div>
                    <div className="text-sm font-medium text-slate-200">Mix</div>
                    {device === 'mix' && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent animate-shimmer"></div>
                    )}
                  </button>
                </div>

                {/* Mix Percentage Control - Enhanced */}
                {device === 'mix' && (
                  <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-slate-300">Platform Distribution</h4>
                      <div className="flex items-center gap-3">
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded border border-green-500/30">
                          📱 {androidPercent}%
                        </span>
                        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded border border-blue-500/30">
                          🍎 {iosPercent}%
                        </span>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={androidPercent}
                        onChange={(e) => setAndroidPercent(parseInt(e.target.value))}
                        className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer slider-modern"
                        style={{
                          background: `linear-gradient(to right, rgb(34 197 94) 0%, rgb(34 197 94) ${androidPercent}%, rgb(59 130 246) ${androidPercent}%, rgb(59 130 246) 100%)`
                        }}
                      />
                      <div className="flex justify-between text-xs text-slate-400 mt-2">
                        <span>100% Android</span>
                        <span>50/50</span>
                        <span>100% iPhone</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Country Selection - Traditional Dropdown */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                    Country / Region
                  </h3>
                  <span className="text-xs text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                    {availableCountries.find(c => c.value === country)?.label || 'Global'}
                  </span>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-1 border border-slate-700/50">
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full h-12 bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-slate-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 12px center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '16px'
                    }}
                  >
                    <option value="usa">🇺🇸 United States (+1)</option>
                    <option value="canada">🇨🇦 Canada (+1)</option>
                    <option value="japan">🇯🇵 Japan (+81)</option>
                    <option value="global">🌍 Global (Mixed)</option>
                  </select>
                </div>
              </div>

              {/* App Selection - Traditional Dropdown */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    App Selection
                  </h3>
                  <span className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 capitalize">
                    {browser.replace('_', ' ')}
                  </span>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-1 border border-slate-700/50">
                  <select
                    value={browser}
                    onChange={(e) => setBrowser(e.target.value)}
                    className="w-full h-12 bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-slate-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 12px center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '16px'
                    }}
                  >
                    <option value="facebook">📘 Facebook App</option>
                    <option value="facebook_lite">📘 Facebook Lite</option>
                    <option value="instagram">📷 Instagram App</option>
                  </select>
                </div>
              </div>

              {/* Version Style - Traditional Dropdown */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                    Version Style
                  </h3>
                  <span className="text-xs text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 capitalize">
                    {version}
                  </span>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-1 border border-slate-700/50">
                  <select
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    className="w-full h-12 bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-slate-100 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 12px center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '16px'
                    }}
                  >
                    <option value="latest">🆕 Latest</option>
                    <option value="old">⏰ Old</option>
                    <option value="mix">🔀 Mix</option>
                  </select>
                </div>
              </div>

              {/* Quantity Control - Modern Slider */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                    Quantity
                  </h3>
                  <span className="text-xs text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                    {count} User Agents
                  </span>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                      <input
                        type="range"
                        min="1"
                        max="20"
                        value={count}
                        onChange={(e) => setCount(parseInt(e.target.value))}
                        className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer slider-modern"
                        style={{
                          background: `linear-gradient(to right, rgb(147 51 234) 0%, rgb(147 51 234) ${(count/20)*100}%, rgb(51 65 85) ${(count/20)*100}%, rgb(51 65 85) 100%)`
                        }}
                      />
                      <div className="flex justify-between text-xs text-slate-400 mt-2">
                        <span>1</span>
                        <span>10</span>
                        <span>20</span>
                      </div>
                    </div>
                    <div className="w-20">
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={count}
                        onChange={(e) => setCount(parseInt(e.target.value) || 5)}
                        className="w-full h-12 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-center text-slate-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Generate Button - Modern Gradient */}
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full h-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white text-lg font-semibold rounded-2xl shadow-2xl shadow-blue-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <div className="relative flex items-center justify-center gap-3">
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span>Generating Magic...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl">🚀</span>
                      <span>Generate User Agents</span>
                    </>
                  )}
                </div>
              </button>

              {/* No Data Message - Modern Empty State */}
              {results.length === 0 && !isLoading && (
                <div className="mt-8 text-center py-16">
                  <div className="relative">
                    <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center border border-blue-500/30">
                      <span className="text-6xl">🤖</span>
                    </div>
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/10 to-indigo-500/10 animate-pulse"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-300 mb-3">Ready to Generate</h3>
                  <p className="text-slate-400 max-w-md mx-auto">
                    Configure your preferences above and click the generate button to create user agents
                  </p>
                </div>
              )}

              {/* Results Section - Modern */}
              {results.length > 0 && (
                <div className="mt-8 space-y-6">
                  {/* Results Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></span>
                      Generated User Agents
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-400">
                        {results.length} of {count} generated
                      </span>
                    </div>
                  </div>

                  {/* Results Table - Enhanced */}
                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl">
                    <div className="overflow-auto max-h-96">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 border-b border-slate-600/50 sticky top-0 backdrop-blur-sm">
                          <tr>
                            <th className="py-4 px-6 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">#</th>
                            <th className="py-4 px-6 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">User Agent String</th>
                            <th className="py-4 px-6 text-center text-xs font-semibold text-slate-300 uppercase tracking-wider">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                          {results.map((ua, index) => (
                            <tr
                              key={index}
                              className="hover:bg-gradient-to-r hover:from-blue-500/5 hover:to-indigo-500/5 transition-all duration-200 group animate-fadeIn"
                              style={{ animationDelay: `${index * 50}ms` }}
                            >
                              <td className="py-4 px-6 text-slate-400 font-medium">
                                <div className="flex items-center gap-2">
                                  <span className="w-6 h-6 rounded-full bg-slate-700/50 flex items-center justify-center text-xs">
                                    {index + 1}
                                  </span>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-4">
                                  <div className="flex-shrink-0">
                                    {(resultDevices[index] || device) === 'android' ? (
                                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 flex items-center justify-center shadow-lg shadow-green-500/25">
                                        <Smartphone size={18} className="text-green-400" />
                                      </div>
                                    ) : (
                                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 flex items-center justify-center shadow-lg shadow-blue-500/25">
                                        <Smartphone size={18} className="text-blue-400" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-mono text-sm text-slate-300 break-all leading-relaxed">
                                      {ua}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className={`text-xs px-2 py-1 rounded-full ${
                                        (resultDevices[index] || device) === 'android' 
                                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                      }`}>
                                        {(resultDevices[index] || device) === 'android' ? '📱 Android' : '🍎 iPhone'}
                                      </span>
                                      <span className="text-xs text-slate-500 capitalize">
                                        {browser.replace('_', ' ')}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-6 text-center">
                                <button
                                  onClick={() => handleCopyIndividual(ua, index)}
                                  className="inline-flex items-center justify-center w-10 h-10 rounded-xl hover:bg-gradient-to-br hover:from-indigo-500/20 hover:to-purple-500/20 text-slate-400 hover:text-white transition-all duration-200 hover:scale-110 border border-transparent hover:border-indigo-500/30"
                                  title="Copy user agent"
                                >
                                  {copiedIndex === index ? (
                                    <span className="text-green-400 text-lg font-bold">✓</span>
                                  ) : (
                                    <Copy size={16} />
                                  )}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Action Buttons - Modern */}
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleClear}
                        className="flex-1 h-12 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/50 hover:border-slate-500/50 text-slate-300 hover:text-white rounded-xl transition-all duration-200 font-medium flex items-center justify-center gap-2"
                      >
                        <span>🗑️</span>
                        Clear Results
                      </button>
                      <button
                        onClick={handleCopy}
                        className="flex-1 h-12 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-xl transition-all duration-200 font-medium flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/50"
                      >
                        {copied ? (
                          <>
                            <span className="text-lg">✓</span>
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy size={16} />
                            Copy All
                          </>
                        )}
                      </button>
                    </div>

                    {/* Export Section - Enhanced */}
                    <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                          <Download size={16} className="text-indigo-400" />
                          Export Results
                        </h4>
                        <span className="text-xs text-slate-500">Multiple formats available</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          onClick={() => handleExport('txt')}
                          className="h-10 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 hover:border-slate-500/50 text-slate-300 hover:text-white rounded-lg transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2"
                        >
                          📄 TXT
                        </button>
                        <button
                          onClick={() => handleExport('csv')}
                          className="h-10 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 hover:border-slate-500/50 text-slate-300 hover:text-white rounded-lg transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2"
                        >
                          📊 CSV
                        </button>
                        <button
                          onClick={() => handleExport('json')}
                          className="h-10 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 hover:border-slate-500/50 text-slate-300 hover:text-white rounded-lg transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2"
                        >
                          📦 JSON
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}