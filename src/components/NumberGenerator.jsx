import React, { useState } from 'react';
import { Copy, Hash } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './Card';
import { Button } from './Button';
import { Select } from './Select';
import { generatePhoneNumbers, getAreaCodesForCountry } from '../utils/numberGenerator';

export default function NumberGenerator() {
  const [country, setCountry] = useState('usa');
  const [numberType, setNumberType] = useState('mobile');
  const [format, setFormat] = useState('formatted');
  const [count, setCount] = useState(5);
  const [areaCode, setAreaCode] = useState('random');
  const [areaCodeSearch, setAreaCodeSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [results, setResults] = useState([]);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    const generated = generatePhoneNumbers(country, numberType, format, count, areaCode);
    setResults(generated);
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
  };

  const handleCopyAll = () => {
    const text = results.map(r => r.number).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setResults([]);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">📞</span>
              Phone Number Generator
            </CardTitle>
            <CardDescription>
              Generate realistic phone numbers for 15+ countries with area codes
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
          {/* Country Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-100">Country</h3>
              <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded">
                15 Countries
              </span>
            </div>
            <Select
              value={country}
              onChange={(e) => handleCountryChange(e.target.value)}
              options={[
                { value: 'usa', label: '🇺🇸 United States (+1)' },
                { value: 'uk', label: '🇬🇧 United Kingdom (+44)' },
                { value: 'canada', label: '🇨🇦 Canada (+1)' },
                { value: 'australia', label: '🇦🇺 Australia (+61)' },
                { value: 'germany', label: '🇩🇪 Germany (+49)' },
                { value: 'france', label: '🇫🇷 France (+33)' },
                { value: 'italy', label: '🇮🇹 Italy (+39)' },
                { value: 'spain', label: '🇪🇸 Spain (+34)' },
                { value: 'netherlands', label: '🇳🇱 Netherlands (+31)' },
                { value: 'sweden', label: '🇸🇪 Sweden (+46)' },
                { value: 'norway', label: '🇳🇴 Norway (+47)' },
                { value: 'denmark', label: '🇩🇰 Denmark (+45)' },
                { value: 'india', label: '🇮🇳 India (+91)' },
                { value: 'japan', label: '🇯🇵 Japan (+81)' },
                { value: 'china', label: '🇨🇳 China (+86)' },
              ]}
              className="w-full"
            />
          </div>

          {/* Number Type Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-100">Number Type</h3>
              <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded capitalize">
                {numberType}
              </span>
            </div>
            <Select
              value={numberType}
              onChange={(e) => {
                setNumberType(e.target.value);
                setAreaCode('random'); // Reset area code when type changes
              }}
              options={[
                { value: 'mobile', label: '📱 Mobile' },
                { value: 'landline', label: '☎️ Landline' },
                { value: 'tollfree', label: '📞 Toll-Free' },
              ]}
              className="w-full"
            />
          </div>

          {/* Area Code Selection with Dropdown */}
          {availableAreaCodes.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-100">Area Code</h3>
                <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded">
                  {areaCode === 'random' ? 'Random' : areaCode}
                </span>
              </div>
              <div className="relative">
                {/* Search Input */}
                <input
                  type="text"
                  id="areaCodeSearch"
                  placeholder="Search area code or location..."
                  value={areaCodeSearch}
                  onChange={(e) => setAreaCodeSearch(e.target.value)}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  className="w-full h-10 rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 ring-offset-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
                />

                {/* Dropdown Options */}
                {showDropdown && (
                  <div
                    id="areaCodeOptions"
                    className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-600 rounded-md shadow-lg shadow-black/30 max-h-60 overflow-y-auto scrollbar-thin"
                  >
                    {/* Random Option */}
                    <div
                      onClick={() => {
                        setAreaCode('random');
                        setAreaCodeSearch('');
                        setShowDropdown(false);
                      }}
                      className={`px-3 py-2 cursor-pointer hover:bg-slate-700 transition-colors ${areaCode === 'random' ? 'bg-indigo-900/50 text-indigo-300 font-medium' : ''
                        }`}
                    >
                      <div className="font-medium">Random (Any Area Code)</div>
                    </div>

                    {/* Filtered Area Codes */}
                    {filteredAreaCodes.length > 0 ? (
                      filteredAreaCodes.map((ac) => (
                        <div
                          key={ac.code}
                          onClick={() => {
                            setAreaCode(ac.code);
                            setAreaCodeSearch(`${ac.code} - ${ac.location}`);
                            setShowDropdown(false);
                          }}
                          className={`px-3 py-2 cursor-pointer hover:bg-slate-700 transition-colors border-t border-slate-700 ${areaCode === ac.code ? 'bg-indigo-900/50 text-indigo-300 font-medium' : ''
                            }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-semibold text-indigo-600">{ac.code}</span>
                            <span className="text-sm text-slate-300">{ac.location}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-4 text-center text-sm text-slate-400 border-t border-slate-700">
                        No area codes found. Try a different search.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Selected Area Code Display */}
              {areaCode !== 'random' && !showDropdown && (
                <div className="flex items-center justify-between p-2 bg-indigo-50 rounded-md border border-indigo-200">
                  <span className="text-sm text-indigo-700">
                    Selected: <span className="font-mono font-semibold">{areaCode}</span>
                  </span>
                  <button
                    onClick={() => {
                      setAreaCode('random');
                      setAreaCodeSearch('');
                    }}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Format Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-100">Format</h3>
              <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded capitalize">
                {format}
              </span>
            </div>
            <Select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              options={[
                { value: 'formatted', label: '📋 Formatted (e.g., +1 (555) 123-4567)' },
                { value: 'plain', label: '📝 Plain (e.g., 15551234567)' },
                { value: 'national', label: '🏠 National (e.g., (555) 123-4567)' },
              ]}
              className="w-full"
            />
          </div>

          {/* Quantity Control */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-100">Quantity</h3>
              <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded">
                {count} Phone Numbers
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="50"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <input
                type="number"
                min="1"
                max="50"
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
            🚀 Generate Phone Numbers
          </Button>

          {/* Results Table */}
          {results.length > 0 && (
            <div className="mt-8 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-100">Generated Phone Numbers</h3>
              </div>

              {/* Table */}
              <div className="border border-slate-600 rounded-lg overflow-hidden bg-slate-800/50 shadow-lg shadow-black/30">
                <div className="overflow-x-auto scrollbar-thin">
                  <div className="max-h-96 overflow-y-auto scrollbar-thin">
                    <table className="w-full min-w-full">
                      <thead className="bg-slate-700/50 border-b border-slate-600 sticky top-0 backdrop-blur-sm">
                        <tr>
                          <th className="py-3 px-4 text-left text-xs font-semibold text-slate-200 uppercase tracking-wider">
                            #
                          </th>
                          <th className="py-3 px-4 text-left text-xs font-semibold text-slate-200 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="py-3 px-4 text-left text-xs font-semibold text-slate-200 uppercase tracking-wider">
                            Area Code
                          </th>
                          <th className="py-3 px-4 text-left text-xs font-semibold text-slate-200 uppercase tracking-wider">
                            Phone Number
                          </th>
                          <th className="py-3 px-4 text-center text-xs font-semibold text-slate-200 uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700">
                        {results.map((result, index) => (
                          <tr
                            key={index}
                            className="hover:bg-slate-700/30 transition-colors"
                          >
                            <td className="py-3 px-4 text-sm text-slate-400 font-medium">
                              {index + 1}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${result.type === 'mobile'
                                  ? 'bg-blue-900/50 text-blue-300 border border-blue-700'
                                  : result.type === 'landline'
                                    ? 'bg-green-900/50 text-green-300 border border-green-700'
                                    : 'bg-purple-900/50 text-purple-300 border border-purple-700'
                                  }`}
                              >
                                {result.type === 'mobile' ? '📱' : result.type === 'landline' ? '☎️' : '📞'}{' '}
                                {result.type}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-mono text-sm font-semibold text-indigo-400">
                                {result.areaCode || 'N/A'}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono text-sm font-medium text-slate-300">
                              {result.number}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={() => handleCopy(result.number)}
                                className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-slate-600 text-slate-400 hover:text-slate-100 transition-colors"
                                title="Copy number"
                              >
                                <Copy size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={handleClear}
                  className="flex-1 sm:flex-none sm:min-w-[150px]"
                >
                  Clear Results
                </Button>
                <Button
                  onClick={handleCopyAll}
                  className="flex-1 sm:flex-auto gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <Copy size={16} className={copied ? 'opacity-0' : 'opacity-100'} />
                  {copied ? 'Copied!' : 'Copy All'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
