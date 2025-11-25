import { useState } from 'react';
import { Copy } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './Card';
import { Button } from './Button';
import { Select } from './Select';
import { generateGmailUsernames } from '../utils/gmailGenerator';
import { useToast } from '../context/ToastContext';
import { useStats } from '../context/StatsContext';

export default function GmailGenerator() {
  const [gender, setGender] = useState('both');
  const [count, setCount] = useState(5);
  const [style, setStyle] = useState('standard');
  const [country, setCountry] = useState('usa');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();
  const { recordGeneration } = useStats();

  const handleGenerate = () => {
    setIsLoading(true);
    setTimeout(() => {
      const generated = generateGmailUsernames(gender, country, style, count);
      setResults(generated);
      setIsLoading(false);
      // Record statistics
      recordGeneration('gmail', count);
      addToast(`${count} emails generated successfully!`, 'success');
    }, 300);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    addToast('Copied to clipboard!', 'success');
  };

  const handleCopyAll = () => {
    const allEmails = results.map(r => r.email).join('\n');
    navigator.clipboard.writeText(allEmails);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast(`${results.length} emails copied!`, 'success');
  };

  const handleCopyName = (name) => {
    navigator.clipboard.writeText(name);
    addToast('Name copied!', 'success');
  };

  const handleClear = () => {
    setResults([]);
    addToast('Results cleared', 'info');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">📧</span>
              Gmail Username Generator
            </CardTitle>
            <CardDescription>
              Generate country-specific Gmail usernames with real-time validation
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
          {/* Gender Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-100">Gender</h3>
              <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded capitalize">
                {gender}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={gender === 'male' ? 'default' : 'outline'}
                onClick={() => setGender('male')}
                className="transition-all duration-200 h-11"
              >
                👨 Male
              </Button>
              <Button
                variant={gender === 'female' ? 'default' : 'outline'}
                onClick={() => setGender('female')}
                className="transition-all duration-200 h-11"
              >
                👩 Female
              </Button>
              <Button
                variant={gender === 'both' ? 'default' : 'outline'}
                onClick={() => setGender('both')}
                className="transition-all duration-200 h-11"
              >
                👥 Both
              </Button>
            </div>
          </div>

          {/* Quantity Control */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-100">Quantity</h3>
              <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded">
                {count} Usernames
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

          {/* Username Style */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-100">Username Style</h3>
              <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded capitalize">
                {style}
              </span>
            </div>
            <Select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              options={[
                { value: 'standard', label: '📝 Standard (name + numbers)' },
                { value: 'professional', label: '💼 Professional (firstname.lastname)' },
                { value: 'creative', label: '🎨 Creative (with special chars)' },
                { value: 'compact', label: '⚡ Compact (shorter)' },
                { value: 'random', label: '🎲 Random Mix' },
              ]}
            />
          </div>

          {/* Country Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-100">Country</h3>
              <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded">
                20 Countries
              </span>
            </div>
            <Select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              options={[
                { value: 'usa', label: 'United States 🇺🇸' },
                { value: 'uk', label: 'United Kingdom 🇬🇧' },
                { value: 'canada', label: 'Canada 🇨🇦' },
                { value: 'australia', label: 'Australia 🇦🇺' },
                { value: 'newzealand', label: 'New Zealand 🇳🇿' },
                { value: 'germany', label: 'Germany 🇩🇪' },
                { value: 'france', label: 'France 🇫🇷' },
                { value: 'italy', label: 'Italy 🇮🇹' },
                { value: 'spain', label: 'Spain 🇪🇸' },
                { value: 'austria', label: 'Austria 🇦🇹' },
                { value: 'switzerland', label: 'Switzerland 🇨🇭' },
                { value: 'netherlands', label: 'Netherlands 🇳🇱' },
                { value: 'sweden', label: 'Sweden 🇸🇪' },
                { value: 'denmark', label: 'Denmark 🇩🇰' },
                { value: 'norway', label: 'Norway 🇳🇴' },
                { value: 'india', label: 'India 🇮🇳' },
                { value: 'japan', label: 'Japan 🇯🇵' },
                { value: 'china', label: 'China 🇨🇳' },
                { value: 'brazil', label: 'Brazil 🇧🇷' },
                { value: 'mexico', label: 'Mexico 🇲🇽' },
              ]}
              className="w-full"
            />
          </div>

          <Button
            onClick={handleGenerate}
            className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-base font-semibold shadow-lg shadow-indigo-900/50"
          >
            🚀 Generate Usernames
          </Button>

          {/* Results Table */}
          {results.length > 0 && (
            <div className="mt-8 space-y-4">
              {/* Header with Legend */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h3 className="text-lg font-semibold text-slate-100">Generated Usernames</h3>
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                    <span className="text-slate-300">Likely Available</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                    <span className="text-slate-300">Uncertain</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                    <span className="text-slate-300">Likely Taken</span>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="border border-slate-600 rounded-lg overflow-hidden bg-slate-800/50 shadow-lg shadow-black/30">
                <div className="overflow-x-auto scrollbar-thin">
                  <div className="max-h-96 overflow-y-auto scrollbar-thin">
                    <table className="w-full min-w-full">
                      <thead className="bg-slate-700/50 border-b border-slate-600 sticky top-0 backdrop-blur-sm">
                        <tr>
                          <th className="py-3 px-4 text-left text-xs font-semibold text-slate-200 uppercase tracking-wider">
                            First Name
                          </th>
                          <th className="py-3 px-4 text-left text-xs font-semibold text-slate-200 uppercase tracking-wider">
                            Last Name
                          </th>
                          <th className="py-3 px-4 text-left text-xs font-semibold text-slate-200 uppercase tracking-wider">
                            Gmail Address
                          </th>
                          <th className="py-3 px-4 text-left text-xs font-semibold text-slate-200 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700">
                        {results.map((result, index) => (
                          <tr
                            key={index}
                            className="hover:bg-slate-700/30 transition-colors"
                          >
                            <td
                              className="py-3 px-4 text-sm font-medium text-slate-100 capitalize cursor-pointer hover:bg-slate-600/50 hover:text-indigo-300 transition-colors"
                              onClick={() => handleCopyName(result.firstName)}
                              title="Click to copy first name"
                            >
                              {result.firstName}
                            </td>
                            <td
                              className="py-3 px-4 text-sm font-medium text-slate-100 capitalize cursor-pointer hover:bg-slate-600/50 hover:text-indigo-300 transition-colors"
                              onClick={() => handleCopyName(result.lastName)}
                              title="Click to copy last name"
                            >
                              {result.lastName}
                            </td>
                            <td
                              className="py-3 px-4 text-sm font-mono text-slate-300 cursor-pointer hover:bg-slate-600/50 hover:text-indigo-300 transition-colors"
                              onClick={() => handleCopy(result.email)}
                              title="Click to copy email"
                            >
                              {result.email}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`w-2 h-2 rounded-full ${result.availability === 'available'
                                    ? 'bg-green-500'
                                    : result.availability === 'uncertain'
                                      ? 'bg-yellow-500'
                                      : 'bg-red-500'
                                    }`}
                                ></span>
                                <span
                                  className={`text-sm font-medium ${result.availability === 'available'
                                    ? 'text-green-400'
                                    : result.availability === 'uncertain'
                                      ? 'text-yellow-400'
                                      : 'text-red-400'
                                    }`}
                                >
                                  {result.availability === 'available'
                                    ? 'Likely Available'
                                    : result.availability === 'uncertain'
                                      ? 'Uncertain'
                                      : 'Likely Taken'}
                                </span>
                              </div>
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
