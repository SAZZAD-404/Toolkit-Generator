import { useState, useCallback, useMemo } from 'react';
import { Copy } from 'lucide-react';
import { Card, CardContent } from './Card';
import { generateGmailUsernames } from '../utils/gmailGenerator';
import { saveEmailHistory, getExistingDataValues } from '../utils/dataStorage';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';
import { Button } from './ui/Button';
import DuplicateStatus from './DuplicateStatus';

export default function GmailGenerator() {
  const [gender, setGender] = useState('both');
  const [count, setCount] = useState(5);
  const [style, setStyle] = useState('standard');
  const [country, setCountry] = useState('usa');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();
  const { addGeneratedData } = useAppData();
  const { toast } = useToast();

  const handleGenerate = useCallback(async () => {
    const startTime = performance.now();
    setIsLoading(true);
    
    // Use requestAnimationFrame for better performance
    requestAnimationFrame(async () => {
      try {
        // Get existing emails for this user
        const existingEmails = user ? await getExistingDataValues('email') : [];
        
        // Generate emails with duplicate prevention
        const generated = generateGmailUsernames(gender, country, style, count, existingEmails);
        
        setResults(generated);
        
        // Calculate and emit generation time
        const endTime = performance.now();
        const generationTime = (endTime - startTime) / 1000;
        
        // Emit generation complete event with timing
        window.dispatchEvent(new CustomEvent('generationComplete', {
          detail: { generationTime, type: 'email', count: generated.length }
        }));
        
        if (generated.length > 0) {
          toast.success(
            'Generation Complete!', 
            `${generated.length} unique emails generated successfully`,
            { duration: 4000 }
          );
          
          // Save to database if user is logged in
          console.log('👤 User status:', user ? 'Logged in' : 'Not logged in');
          console.log('📧 Generated emails count:', generated.length);
          
          if (user) {
            try {
              console.log('💾 Saving emails to database...');
              // Save each generated email to the database
              for (const result of generated) {
                const saveResult = await saveEmailHistory(
                  result.email,
                  result.firstName,
                  result.lastName,
                  country,
                  style,
                  addGeneratedData
                );
                console.log('📧 Email save result:', saveResult.success ? '✅' : '❌', result.email);
              }
              console.log('✅ All emails saved successfully');
            } catch (error) {
              console.error('❌ Error saving generated data:', error);
            }
          } else {
            console.log('⚠️ User not logged in, emails will be saved to localStorage only');
            // Still save to localStorage for non-authenticated users
            try {
              for (const result of generated) {
                const saveResult = await saveEmailHistory(
                  result.email,
                  result.firstName,
                  result.lastName,
                  country,
                  style,
                  addGeneratedData
                );
                console.log('📧 Email localStorage save:', saveResult.success ? '✅' : '❌', result.email);
              }
            } catch (error) {
              console.error('❌ Error saving to localStorage:', error);
            }
          }
          
          // Trigger dashboard update
          window.dispatchEvent(new CustomEvent('generationComplete', {
            detail: { type: 'email', count: generated.length }
          }));
          console.log('📡 Dashboard update event triggered');
        } else {
          toast.warning(
            'No New Emails', 
            'No new unique emails could be generated. Try different settings.',
            { duration: 5000 }
          );
        }
      } catch (error) {
        console.error('Generation error:', error);
        toast.error('Generation Failed', 'Please try again');
      } finally {
        setIsLoading(false);
      }
    });
  }, [gender, country, style, count, user, toast, addGeneratedData]);

  const handleCopy = useCallback((text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied!', 'Email copied to clipboard');
  }, [toast]);

  const handleCopyAll = useCallback(() => {
    const allEmails = results.map(r => r.email).join('\n');
    navigator.clipboard.writeText(allEmails);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('All Copied!', `${results.length} emails copied to clipboard`);
  }, [results, toast]);

  const handleCopyName = useCallback((name) => {
    navigator.clipboard.writeText(name);
    toast.success('Name Copied!', 'Username copied to clipboard');
  }, [toast]);

  const handleClear = useCallback(() => {
    setResults([]);
    toast.info('Cleared', 'All results have been cleared');
  }, [toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <div className="p-4 md:p-6 space-y-6">
        {/* Modern Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-indigo-600/10 backdrop-blur-xl rounded-3xl border border-purple-500/20 p-6 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-transparent to-blue-600/5"></div>
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                <span className="text-2xl">📧</span>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Gmail Username Generator
                </h1>
                <p className="text-slate-400 mt-1">Generate unique, country-specific Gmail addresses</p>
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
        <DuplicateStatus dataType="email" />

        <Card className="w-full flex flex-col shadow-2xl bg-slate-800/50 backdrop-blur-xl border-slate-700/50">
          <CardContent className="p-6">
            <div className="space-y-8">
              {/* Gender Selection - Modern Cards */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                    Gender Selection
                  </h3>
                  <span className="text-xs text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20 capitalize">
                    {gender}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setGender('male')}
                    className={`relative overflow-hidden p-4 rounded-xl border transition-all duration-300 group ${
                      gender === 'male'
                        ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/50 shadow-lg shadow-blue-500/25'
                        : 'bg-slate-800/50 border-slate-600/50 hover:border-blue-500/30 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="text-2xl mb-2">👨</div>
                    <div className="text-sm font-medium text-slate-200">Male</div>
                    {gender === 'male' && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent animate-shimmer"></div>
                    )}
                  </button>
                  <button
                    onClick={() => setGender('female')}
                    className={`relative overflow-hidden p-4 rounded-xl border transition-all duration-300 group ${
                      gender === 'female'
                        ? 'bg-gradient-to-br from-pink-500/20 to-pink-600/20 border-pink-500/50 shadow-lg shadow-pink-500/25'
                        : 'bg-slate-800/50 border-slate-600/50 hover:border-pink-500/30 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="text-2xl mb-2">👩</div>
                    <div className="text-sm font-medium text-slate-200">Female</div>
                    {gender === 'female' && (
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-transparent animate-shimmer"></div>
                    )}
                  </button>
                  <button
                    onClick={() => setGender('both')}
                    className={`relative overflow-hidden p-4 rounded-xl border transition-all duration-300 group ${
                      gender === 'both'
                        ? 'bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/50 shadow-lg shadow-purple-500/25'
                        : 'bg-slate-800/50 border-slate-600/50 hover:border-purple-500/30 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="text-2xl mb-2">👥</div>
                    <div className="text-sm font-medium text-slate-200">Both</div>
                    {gender === 'both' && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent animate-shimmer"></div>
                    )}
                  </button>
                </div>
              </div>

              {/* Quantity Control - Modern Slider */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                    Quantity
                  </h3>
                  <span className="text-xs text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                    {count} Usernames
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
                          background: `linear-gradient(to right, rgb(99 102 241) 0%, rgb(99 102 241) ${(count/20)*100}%, rgb(51 65 85) ${(count/20)*100}%, rgb(51 65 85) 100%)`
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
                        className="w-full h-12 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-center text-slate-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Username Style - Traditional Dropdown */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    Username Style
                  </h3>
                  <span className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 capitalize">
                    {style}
                  </span>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-1 border border-slate-700/50">
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full h-12 bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-slate-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 12px center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '16px'
                    }}
                  >
                    <option value="standard">📝 Standard (name + numbers)</option>
                    <option value="professional">💼 Professional (firstname.lastname)</option>
                    <option value="creative">🎨 Creative (with special chars)</option>
                    <option value="compact">⚡ Compact (shorter format)</option>
                    <option value="random">🎲 Random Mix (mixed styles)</option>
                  </select>
                </div>
              </div>

              {/* Country Selection - Traditional Dropdown */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                    Country Selection
                  </h3>
                  <span className="text-xs text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                    20 Countries
                  </span>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-1 border border-slate-700/50">
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
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
                    <option value="brazil">🇧🇷 Brazil (+55)</option>
                    <option value="mexico">🇲🇽 Mexico (+52)</option>
                    <option value="austria">🇦🇹 Austria (+43)</option>
                    <option value="switzerland">🇨🇭 Switzerland (+41)</option>
                    <option value="newzealand">🇳🇿 New Zealand (+64)</option>
                  </select>
                </div>
              </div>

              {/* Generate Button - Professional */}
              <Button
                onClick={handleGenerate}
                loading={isLoading}
                disabled={isLoading}
                size="lg"
                className="w-full h-16 text-lg font-semibold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-500 hover:via-blue-500 hover:to-indigo-500 shadow-2xl shadow-purple-900/50 relative overflow-hidden group"
                leftIcon={!isLoading && <span className="text-2xl">🚀</span>}
              >
                {isLoading ? 'Generating Magic...' : 'Generate Usernames'}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </Button>

              {/* No Data Message - Modern Empty State */}
              {results.length === 0 && !isLoading && (
                <div className="mt-8 text-center py-16">
                  <div className="relative">
                    <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-purple-500/30">
                      <span className="text-6xl">📧</span>
                    </div>
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 animate-pulse"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-300 mb-3">Ready to Generate</h3>
                  <p className="text-slate-400 max-w-md mx-auto">
                    Configure your preferences above and click the generate button to create unique Gmail usernames
                  </p>
                </div>
              )}

              {/* Results Section - Modern Cards */}
              {results.length > 0 && (
                <div className="mt-8 space-y-6">
                  {/* Results Header */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></span>
                        Generated Results
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-400">
                          {results.length} of {count} generated
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Card View - Enhanced */}
                  <div className="block md:hidden space-y-3">
                    {results.map((result, index) => (
                      <div
                        key={index}
                        className="relative overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-5 shadow-xl hover:shadow-2xl transition-all duration-300 group animate-fadeIn"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        <div className="relative space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-400 bg-slate-700/50 px-2 py-1 rounded-full">
                              #{index + 1}
                            </span>
                          </div>
                          
                          <div className="space-y-3">
                            <button
                              className="w-full p-4 bg-slate-700/30 rounded-xl cursor-pointer hover:bg-slate-600/50 transition-all duration-200 text-left group/item"
                              onClick={() => handleCopyName(`${result.firstName} ${result.lastName}`)}
                            >
                              <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
                                <span>Full Name</span>
                                <Copy size={12} className="opacity-0 group-hover/item:opacity-100 transition-opacity" />
                              </div>
                              <div className="text-sm font-medium text-slate-100 capitalize">
                                {result.firstName} {result.lastName}
                              </div>
                            </button>
                            
                            <button
                              className="w-full p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl cursor-pointer hover:from-purple-500/20 hover:to-blue-500/20 transition-all duration-200 text-left group/item border border-purple-500/20"
                              onClick={() => handleCopy(result.email)}
                            >
                              <div className="text-xs text-purple-400 mb-1 flex items-center justify-between">
                                <span>Gmail Address</span>
                                <Copy size={12} className="opacity-0 group-hover/item:opacity-100 transition-opacity" />
                              </div>
                              <div className="text-sm font-mono text-slate-300 break-all">
                                {result.email}
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table View - Enhanced */}
                  <div className="hidden md:block">
                    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl">
                      <div className="overflow-auto max-h-96">
                        <table className="w-full">
                          <thead className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 border-b border-slate-600/50 sticky top-0 backdrop-blur-sm">
                            <tr>
                              <th className="py-4 px-6 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                First Name
                              </th>
                              <th className="py-4 px-6 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                Last Name
                              </th>
                              <th className="py-4 px-6 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                Gmail Address
                              </th>
                              <th className="py-4 px-6 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-700/50">
                            {results.map((result, index) => (
                              <tr
                                key={index}
                                className="hover:bg-gradient-to-r hover:from-purple-500/5 hover:to-blue-500/5 transition-all duration-200 group animate-fadeIn"
                                style={{ animationDelay: `${index * 50}ms` }}
                              >
                                <td
                                  className="py-4 px-6 text-sm font-medium text-slate-100 capitalize cursor-pointer hover:text-purple-300 transition-colors group/cell"
                                  onClick={() => handleCopyName(result.firstName)}
                                  title="Click to copy first name"
                                >
                                  <div className="flex items-center gap-2">
                                    {result.firstName}
                                    <Copy size={14} className="opacity-0 group-hover/cell:opacity-100 transition-opacity" />
                                  </div>
                                </td>
                                <td
                                  className="py-4 px-6 text-sm font-medium text-slate-100 capitalize cursor-pointer hover:text-purple-300 transition-colors group/cell"
                                  onClick={() => handleCopyName(result.lastName)}
                                  title="Click to copy last name"
                                >
                                  <div className="flex items-center gap-2">
                                    {result.lastName}
                                    <Copy size={14} className="opacity-0 group-hover/cell:opacity-100 transition-opacity" />
                                  </div>
                                </td>
                                <td
                                  className="py-4 px-6 text-sm font-mono text-slate-300 cursor-pointer hover:text-blue-300 transition-colors group/cell"
                                  onClick={() => handleCopy(result.email)}
                                  title="Click to copy email"
                                >
                                  <div className="flex items-center gap-2">
                                    {result.email}
                                    <Copy size={14} className="opacity-0 group-hover/cell:opacity-100 transition-opacity" />
                                  </div>
                                </td>
                                <td className="py-4 px-6">
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`w-3 h-3 rounded-full shadow-lg ${
                                        result.availability === 'available'
                                          ? 'bg-green-500 shadow-green-500/50'
                                          : result.availability === 'uncertain'
                                          ? 'bg-yellow-500 shadow-yellow-500/50'
                                          : 'bg-red-500 shadow-red-500/50'
                                      }`}
                                    ></div>
                                    <span
                                      className={`text-sm font-medium ${
                                        result.availability === 'available'
                                          ? 'text-green-400'
                                          : result.availability === 'uncertain'
                                          ? 'text-yellow-400'
                                          : 'text-red-400'
                                      }`}
                                    >
                                      {result.availability === 'available'
                                        ? 'Generated'
                                        : result.availability === 'uncertain'
                                        ? 'Generated'
                                        : 'Generated'}
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

                  {/* Action Buttons - Modern */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleClear}
                      className="flex-1 h-12 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/50 hover:border-slate-500/50 text-slate-300 hover:text-white rounded-xl transition-all duration-200 font-medium"
                    >
                      Clear Results
                    </button>
                    <button
                      onClick={handleCopyAll}
                      className="flex-1 h-12 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-xl transition-all duration-200 font-medium flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/50"
                    >
                      <Copy size={16} className={copied ? 'opacity-0' : 'opacity-100'} />
                      <span>{copied ? 'Copied!' : 'Copy All Emails'}</span>
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