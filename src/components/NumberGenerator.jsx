import { useState } from 'react';
import { Copy, Hash } from 'lucide-react';
import { Card, CardContent } from './Card';
import { generatePhoneNumbers, getAreaCodesForCountry } from '../utils/numberGenerator';
import { saveGeneratedData, getExistingDataValues } from '../utils/dataStorage';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';
import DuplicateStatus from './DuplicateStatus';

export default function NumberGenerator() {
  const [country, setCountry] = useState('usa');
  const [numberType, setNumberType] = useState('mobile');
  const [format, setFormat] = useState('plain');
  const [count, setCount] = useState(5);
  const [areaCode, setAreaCode] = useState('random');
  const [areaCodeSearch, setAreaCodeSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [results, setResults] = useState([]);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { addGeneratedData } = useAppData();
  const { addToast } = useToast();

  const handleGenerate = async () => {
    const startTime = performance.now(); // Track generation start time
    setIsLoading(true);
    
    // Get existing phone numbers for this user
    const existingPhones = user ? await getExistingDataValues('phone') : [];
    
    let uniqueResults = [];
    let attempts = 0;
    const maxAttempts = count * 5; // Try 5 times more than needed
    
    while (uniqueResults.length < count && attempts < maxAttempts) {
      const generated = generatePhoneNumbers(country, numberType, format, count - uniqueResults.length, areaCode);
      
      // Filter out duplicates
      const newUnique = generated.filter(result => 
        !existingPhones.includes(result.number) && 
        !uniqueResults.some(existing => existing.number === result.number)
      );
      
      uniqueResults.push(...newUnique);
      attempts++;
    }
    
    // Take only what we need
    uniqueResults = uniqueResults.slice(0, count);
    
    setResults(uniqueResults);
    
    // Calculate and emit generation time
    const endTime = performance.now();
    const generationTime = (endTime - startTime) / 1000; // Convert to seconds
    
    // Emit generation complete event with timing
    window.dispatchEvent(new CustomEvent('generationComplete', {
      detail: { generationTime, type: 'phone', count: uniqueResults.length }
    }));
    
    if (uniqueResults.length > 0) {
      addToast(`${uniqueResults.length} unique phone numbers generated!`, 'success');

      // Save to database if user is logged in
      if (user) {
        try {
          for (const result of uniqueResults) {
            await saveGeneratedData('phone', result.number, {
              country: country,
              numberType: numberType,
              format: format,
              areaCode: result.areaCode || areaCode,
              location: result.location || 'Unknown'
            }, addGeneratedData);
          }
        } catch (error) {
          console.error('Error saving generated data:', error);
        }
      }
    } else {
      addToast('No new unique phone numbers could be generated. Try different settings.', 'warning');
    }
    
    setIsLoading(false);
  };

  const handleCountryChange = (newCountry) => {
    setCountry(newCountry);
    setAreaCode('random'); // Reset area code when country changes
    setAreaCodeSearch('');
  };

  // Get available area codes for current country
  const availableAreaCodes = getAreaCodesForCountry(country, numberType);

  // Filter area codes based on search
  const filteredAreaCodes = availableAreaCodes.filter(ac =>
    ac.code.includes(areaCodeSearch) ||
    ac.location.toLowerCase().includes(areaCodeSearch.toLowerCase())
  );

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast('Phone number copied to clipboard!', 'success');
  };

  const handleCopyAll = () => {
    const text = results.map(r => r.number).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast(`${results.length} phone numbers copied!`, 'success');
  };

  const handleClear = () => {
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900/20 to-slate-900">
      <div className="p-4 md:p-6 space-y-6">
        {/* Modern Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-orange-600/10 via-red-600/10 to-pink-600/10 backdrop-blur-xl rounded-3xl border border-orange-500/20 p-6 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/5 via-transparent to-pink-600/5"></div>
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/25">
                <Hash size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
                  Phone Number Generator
                </h1>
                <p className="text-slate-400 mt-1">Generate realistic phone numbers for 15+ countries</p>
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
        <DuplicateStatus dataType="phone" />

        <Card className="w-full flex flex-col shadow-2xl bg-slate-800/50 backdrop-blur-xl border-slate-700/50">
          <CardContent className="p-6">
            <div className="space-y-8">
              {/* Country Selection - Modern Dropdown */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                    Country Selection
                  </h3>
                  <span className="text-xs text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                    15 Countries
                  </span>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-1 border border-slate-700/50">
                  <select
                    value={country}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full h-12 bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-slate-100 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 12px center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '16px'
                    }}
                  >
                    <option value="usa">🇺🇸 United States (+1)</option>
                    <option value="uk">🇬🇧 United Kingdom (+44)</option>
                    <option value="canada">🇨🇦 Canada (+1)</option>
                    <option value="australia">🇦🇺 Australia (+61)</option>
                    <option value="germany">🇩🇪 Germany (+49)</option>
                    <option value="france">🇫🇷 France (+33)</option>
                    <option value="italy">🇮🇹 Italy (+39)</option>
                    <option value="spain">🇪🇸 Spain (+34)</option>
                    <option value="netherlands">🇳🇱 Netherlands (+31)</option>
                    <option value="sweden">🇸🇪 Sweden (+46)</option>
                    <option value="norway">🇳🇴 Norway (+47)</option>
                    <option value="denmark">🇩🇰 Denmark (+45)</option>
                    <option value="india">🇮🇳 India (+91)</option>
                    <option value="japan">🇯🇵 Japan (+81)</option>
                    <option value="china">🇨🇳 China (+86)</option>
                  </select>
                </div>
              </div>

              {/* Number Type Selection - Modern Dropdown */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-400"></span>
                    Number Type
                  </h3>
                  <span className="text-xs text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20 capitalize">
                    {numberType}
                  </span>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-1 border border-slate-700/50">
                  <select
                    value={numberType}
                    onChange={(e) => {
                      setNumberType(e.target.value);
                      setAreaCode('random');
                    }}
                    className="w-full h-12 bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-slate-100 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 12px center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '16px'
                    }}
                  >
                    <option value="mobile">📱 Mobile</option>
                    <option value="landline">☎️ Landline</option>
                    <option value="tollfree">📞 Toll-Free</option>
                  </select>
                </div>
              </div>

              {/* Format Selection - Modern Dropdown */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-pink-400"></span>
                    Format Style
                  </h3>
                  <span className="text-xs text-pink-400 bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/20 capitalize">
                    {format}
                  </span>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-1 border border-slate-700/50">
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full h-12 bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-slate-100 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 12px center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '16px'
                    }}
                  >
                    <option value="plain">📝 Plain (e.g., 15551234567)</option>
                    <option value="formatted">📋 Formatted (e.g., +1 (555) 123-4567)</option>
                    <option value="national">🏠 National (e.g., (555) 123-4567)</option>
                  </select>
                </div>
              </div>

              {/* Area Code Selection - Enhanced */}
              {availableAreaCodes.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                      Area Code Selection
                    </h3>
                    <span className="text-xs text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                      {areaCode === 'random' ? 'Random' : areaCode}
                    </span>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search area code or location..."
                        value={areaCodeSearch}
                        onChange={(e) => setAreaCodeSearch(e.target.value)}
                        onFocus={() => setShowDropdown(true)}
                        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                        className="w-full h-12 rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-slate-100 placeholder:text-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      />

                      {showDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-lg shadow-black/30 max-h-60 overflow-y-auto scrollbar-thin">
                          <div
                            onClick={() => {
                              setAreaCode('random');
                              setAreaCodeSearch('');
                              setShowDropdown(false);
                            }}
                            className={`px-4 py-3 cursor-pointer hover:bg-slate-700 transition-colors ${
                              areaCode === 'random' ? 'bg-purple-500/20 text-purple-300 font-medium' : ''
                            }`}
                          >
                            <div className="font-medium">Random (Any Area Code)</div>
                          </div>

                          {filteredAreaCodes.length > 0 ? (
                            filteredAreaCodes.map((ac) => (
                              <div
                                key={ac.code}
                                onClick={() => {
                                  setAreaCode(ac.code);
                                  setAreaCodeSearch(`${ac.code} - ${ac.location}`);
                                  setShowDropdown(false);
                                }}
                                className={`px-4 py-3 cursor-pointer hover:bg-slate-700 transition-colors border-t border-slate-700 ${
                                  areaCode === ac.code ? 'bg-purple-500/20 text-purple-300 font-medium' : ''
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-mono font-semibold text-purple-400">{ac.code}</span>
                                  <span className="text-sm text-slate-300">{ac.location}</span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-4 text-center text-sm text-slate-400 border-t border-slate-700">
                              No area codes found. Try a different search.
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {areaCode !== 'random' && !showDropdown && (
                      <div className="flex items-center justify-between mt-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <span className="text-sm text-purple-300">
                          Selected: <span className="font-mono font-semibold">{areaCode}</span>
                        </span>
                        <button
                          onClick={() => {
                            setAreaCode('random');
                            setAreaCodeSearch('');
                          }}
                          className="text-xs text-purple-400 hover:text-purple-300 font-medium"
                        >
                          Clear
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Quantity Control - Modern Slider */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    Quantity
                  </h3>
                  <span className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    {count} Phone Numbers
                  </span>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                      <input
                        type="range"
                        min="1"
                        max="50"
                        value={count}
                        onChange={(e) => setCount(parseInt(e.target.value))}
                        className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer slider-modern"
                        style={{
                          background: `linear-gradient(to right, rgb(16 185 129) 0%, rgb(16 185 129) ${(count/50)*100}%, rgb(51 65 85) ${(count/50)*100}%, rgb(51 65 85) 100%)`
                        }}
                      />
                      <div className="flex justify-between text-xs text-slate-400 mt-2">
                        <span>1</span>
                        <span>25</span>
                        <span>50</span>
                      </div>
                    </div>
                    <div className="w-20">
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={count}
                        onChange={(e) => setCount(parseInt(e.target.value) || 5)}
                        className="w-full h-12 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-center text-slate-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Generate Button - Modern Gradient */}
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full h-16 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 hover:from-orange-500 hover:via-red-500 hover:to-pink-500 text-white text-lg font-semibold rounded-2xl shadow-2xl shadow-orange-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 relative overflow-hidden group"
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
                      <span>Generate Phone Numbers</span>
                    </>
                  )}
                </div>
              </button>

          {/* No Data Message - Modern Empty State */}
          {results.length === 0 && !isLoading && (
            <div className="mt-8 text-center py-16">
              <div className="relative">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center border border-orange-500/30">
                  <span className="text-6xl">📞</span>
                </div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-orange-500/10 to-red-500/10 animate-pulse"></div>
              </div>
              <h3 className="text-xl font-semibold text-slate-300 mb-3">Ready to Generate</h3>
              <p className="text-slate-400 max-w-md mx-auto">
                Configure your preferences above and click the generate button to create phone numbers
              </p>
            </div>
          )}

          {/* Results Table - Enhanced */}
          {results.length > 0 && (
            <div className="mt-8 flex-1 flex flex-col min-h-0">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></span>
                  Generated Phone Numbers
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">
                    {results.length} of {count} generated
                  </span>
                </div>
              </div>

              {/* Table - Enhanced */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl flex-1 min-h-0">
                <div className="h-full flex flex-col">
                  <div className="flex-1 overflow-auto">
                    <table className="w-full min-w-full">
                      <thead className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 border-b border-slate-600/50 sticky top-0 backdrop-blur-sm">
                        <tr>
                          <th className="py-4 px-6 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                            #
                          </th>
                          <th className="py-4 px-6 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="py-4 px-6 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                            Area Code
                          </th>
                          <th className="py-4 px-6 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                            Location
                          </th>
                          <th className="py-4 px-6 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                            Phone Number
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/50">
                        {results.map((result, index) => (
                          <tr
                            key={index}
                            className="hover:bg-gradient-to-r hover:from-orange-500/5 hover:to-red-500/5 transition-all duration-200 group animate-fadeIn"
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <td className="py-4 px-6 text-slate-400 font-medium">
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-slate-700/50 flex items-center justify-center text-xs">
                                  {index + 1}
                                </span>
                              </div>
                            </td>
                            <td
                              className="py-4 px-6 cursor-pointer hover:bg-slate-600/50 transition-colors"
                              onClick={() => handleCopy(result.number)}
                              title="Click to copy phone number"
                            >
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${result.type === 'mobile'
                                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                  : result.type === 'landline'
                                    ? 'bg-green-500/20 text-green-300 border-green-500/30'
                                    : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                                  }`}
                              >
                                {result.type === 'mobile' ? '📱' : result.type === 'landline' ? '☎️' : '📞'}{' '}
                                {result.type}
                              </span>
                            </td>
                            <td
                              className="py-4 px-6 cursor-pointer hover:bg-slate-600/50 transition-colors"
                              onClick={() => handleCopy(result.number)}
                              title="Click to copy phone number"
                            >
                              <span className="font-mono text-sm font-semibold text-orange-400">
                                {result.areaCode || 'N/A'}
                              </span>
                            </td>
                            <td
                              className="py-4 px-6 cursor-pointer hover:bg-slate-600/50 transition-colors"
                              onClick={() => handleCopy(result.number)}
                              title="Click to copy phone number"
                            >
                              <span className="text-sm text-slate-300">
                                {result.areaName || 'N/A'}
                              </span>
                            </td>
                            <td
                              className="py-4 px-6 font-mono text-sm font-medium text-slate-300 cursor-pointer hover:bg-slate-600/50 hover:text-orange-300 transition-colors"
                              onClick={() => handleCopy(result.number)}
                              title="Click to copy phone number"
                            >
                              {result.number}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Modern */}
              <div className="flex flex-col sm:flex-row gap-3 mt-4 flex-shrink-0">
                <button
                  onClick={handleClear}
                  className="flex-1 h-12 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/50 hover:border-slate-500/50 text-slate-300 hover:text-white rounded-xl transition-all duration-200 font-medium flex items-center justify-center gap-2"
                >
                  <span>🗑️</span>
                  Clear Results
                </button>
                <button
                  onClick={handleCopyAll}
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
                      Copy All Numbers
                    </>
                  )}
                </button>
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
