import { useState } from 'react';
import { Copy, Smartphone, Download } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './Card';
import { Button } from './Button';
import { Select } from './Select';
import { generateUserAgents } from '../utils/userAgentGenerator';
import { useToast } from '../context/ToastContext';

export default function UserAgentGenerator() {
  const [device, setDevice] = useState('android');
  const [browser, setBrowser] = useState('chrome');
  const [version, setVersion] = useState('latest');
  const [count, setCount] = useState(5);
  const [results, setResults] = useState([]);
  const [resultDevices, setResultDevices] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copied, setCopied] = useState(false);
  const [androidPercent, setAndroidPercent] = useState(60);
  const iosPercent = 100 - androidPercent;
  const { addToast } = useToast();

  const handleGenerate = () => {
    if (device === 'mix') {
      const androidCount = Math.round(count * (androidPercent / 100));
      const iosCount = count - androidCount;

      let androidUAs, iosUAs;
      if (version === 'mix') {
        androidUAs = [];
        for (let i = 0; i < androidCount; i++) {
          const randomVersion = ['latest', 'recent', 'old'][Math.floor(Math.random() * 3)];
          androidUAs.push(...generateUserAgents('android', browser, randomVersion, 1));
        }
        iosUAs = [];
        for (let i = 0; i < iosCount; i++) {
          const randomVersion = ['latest', 'recent', 'old'][Math.floor(Math.random() * 3)];
          iosUAs.push(...generateUserAgents('iphone', browser, randomVersion, 1));
        }
      } else {
        androidUAs = generateUserAgents('android', browser, version, androidCount);
        iosUAs = generateUserAgents('iphone', browser, version, iosCount);
      }

      const combined = [...androidUAs.map((ua) => ({ ua, device: 'android' })),
      ...iosUAs.map((ua) => ({ ua, device: 'iphone' }))];
      const shuffled = combined.sort(() => Math.random() - 0.5);

      setResults(shuffled.map(item => item.ua));
      setResultDevices(shuffled.map(item => item.device));
    } else {
      let generated;
      if (version === 'mix') {
        generated = [];
        for (let i = 0; i < count; i++) {
          const randomVersion = ['latest', 'recent', 'old'][Math.floor(Math.random() * 3)];
          generated.push(...generateUserAgents(device, browser, randomVersion, 1));
        }
      } else {
        generated = generateUserAgents(device, browser, version, count);
      }
      setResults(generated);
      setResultDevices(Array(count).fill(device));
    }
    addToast(`${count} user agents generated!`, 'success');
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
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Smartphone size={24} className="text-indigo-400" />
              User Agent Generator
            </CardTitle>
            <CardDescription>
              Generate real, valid user agents for Android & iPhone with latest 2025 versions
            </CardDescription>
          </div>
          {results.length > 0 && (
            <div className="text-right">
              <p className="text-2xl font-bold text-indigo-400">{results.length}</p>
              <p className="text-xs text-slate-400">Generated</p>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {/* Device Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-100">Device Platform</h3>
              <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded">
                {device === 'android' ? '📱 Android' : device === 'iphone' ? '🍎 iOS' : `🔀 Mix (${androidPercent}% Android, ${iosPercent}% iOS)`}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={device === 'android' ? 'default' : 'outline'}
                onClick={() => setDevice('android')}
                className="transition-all duration-200 h-12 text-base"
              >
                📱 Android
              </Button>
              <Button
                variant={device === 'iphone' ? 'default' : 'outline'}
                onClick={() => setDevice('iphone')}
                className="transition-all duration-200 h-12 text-base"
              >
                🍎 iPhone
              </Button>
              <Button
                variant={device === 'mix' ? 'default' : 'outline'}
                onClick={() => setDevice('mix')}
                className="transition-all duration-200 h-12 text-base"
              >
                🔀 Mix
              </Button>
            </div>

            {/* Mix Percentage Control */}
            {device === 'mix' && (
              <div className="mt-4 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="bg-green-900/50 text-green-400 px-2 py-1 rounded">📱 {androidPercent}%</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="bg-blue-900/50 text-blue-400 px-2 py-1 rounded">🍎 {iosPercent}%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={androidPercent}
                    onChange={(e) => setAndroidPercent(parseInt(e.target.value))}
                    className="w-full h-2 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Browser Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-100">Browser / App</h3>
              <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded capitalize">
                {browser.replace('_', ' ')}
              </span>
            </div>
            <Select
              value={browser}
              onChange={(e) => setBrowser(e.target.value)}
              options={[
                { value: 'chrome', label: 'Chrome Mobile ' },
                { value: 'facebook', label: 'Facebook App ' },
                { value: 'facebook_lite', label: 'Facebook Lite ' },
                { value: 'instagram', label: 'Instagram App ' },
                { value: 'opera', label: 'Opera Mobile' },
                { value: 'uc', label: 'UC Browser' },
                { value: 'samsung', label: 'Samsung Internet' },
                { value: 'firefox', label: 'Firefox Mobile' },
              ]}
              className="w-full"
            />
          </div>

          {/* Version Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-100">Version Style</h3>
              <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded capitalize">
                {version}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <Button
                variant={version === 'latest' ? 'default' : 'outline'}
                onClick={() => setVersion('latest')}
                className="transition-all duration-200 h-11"
              >
                🆕 Latest
              </Button>
              <Button
                variant={version === 'recent' ? 'default' : 'outline'}
                onClick={() => setVersion('recent')}
                className="transition-all duration-200 h-11"
              >
                📅 Recent
              </Button>
              <Button
                variant={version === 'old' ? 'default' : 'outline'}
                onClick={() => setVersion('old')}
                className="transition-all duration-200 h-11"
              >
                ⏰ Old
              </Button>
              <Button
                variant={version === 'mix' ? 'default' : 'outline'}
                onClick={() => setVersion('mix')}
                className="transition-all duration-200 h-11"
              >
                🔀 Mix
              </Button>
            </div>
          </div>

          {/* Count Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-lg font-semibold text-slate-100">
                Quantity
              </label>
              <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded">
                {count} User Agents
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="20"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <input
                type="number"
                min="1"
                max="20"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value) || 5)}
                className="w-20 h-10 rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 text-center ring-offset-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
              />
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-base font-semibold shadow-lg shadow-indigo-900/50"
          >
            🚀 Generate User Agents
          </Button>

          {/* Results */}
          {results.length > 0 && (
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-100">Generated User Agents</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 bg-slate-700/50 px-3 py-1.5 rounded-full">
                    {results.length} Results
                  </span>
                </div>
              </div>

              <div className="border-2 border-slate-600 rounded-lg overflow-hidden bg-slate-800/50 shadow-lg shadow-black/30">
                <div className="max-h-96 overflow-y-auto scrollbar-thin">
                  <table className="w-full">
                    <thead className="bg-slate-700/50 border-b border-slate-600 sticky top-0 backdrop-blur-sm">
                      <tr>
                        <th className="py-3 px-4 text-left text-xs font-semibold text-slate-200 uppercase tracking-wider">#</th>
                        <th className="py-3 px-4 text-left text-xs font-semibold text-slate-200 uppercase tracking-wider">User Agent String</th>
                        <th className="py-3 px-4 text-center text-xs font-semibold text-slate-200 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {results.map((ua, index) => (
                        <tr
                          key={index}
                          className="hover:bg-slate-700/30 transition-colors"
                        >
                          <td className="py-3 px-4 text-slate-400 font-medium">
                            {index + 1}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0">
                                {(resultDevices[index] || device) === 'android' ? (
                                  <div className="w-8 h-8 rounded-full bg-green-900/30 border border-green-700 flex items-center justify-center">
                                    <Smartphone size={16} className="text-green-400" />
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-blue-900/30 border border-blue-700 flex items-center justify-center">
                                    <Smartphone size={16} className="text-blue-400" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-mono text-xs text-slate-300 break-all leading-relaxed">
                                  {ua}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => handleCopyIndividual(ua, index)}
                              className="inline-flex items-center justify-center w-9 h-9 rounded-lg hover:bg-indigo-600 text-slate-400 hover:text-white transition-all duration-200 hover:scale-110"
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

              <div className="space-y-3 pt-2">
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleClear}
                    className="flex-1 h-11 gap-2"
                  >
                    🗑️ Clear Results
                  </Button>
                  <Button
                    onClick={handleCopy}
                    className="flex-1 h-11 gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
                  >
                    {copied ? '✓ Copied!' : '📋 Copy All'}
                    {!copied && <Copy size={16} />}
                  </Button>
                </div>

                <div className="border-t border-slate-700 pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                      <Download size={16} className="text-indigo-400" />
                      Export Results
                    </h4>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleExport('txt')}
                      className="h-10 gap-2 text-xs"
                    >
                      📄 TXT
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleExport('csv')}
                      className="h-10 gap-2 text-xs"
                    >
                      📊 CSV
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleExport('json')}
                      className="h-10 gap-2 text-xs"
                    >
                      📦 JSON
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
