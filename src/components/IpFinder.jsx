import { useState, useEffect } from 'react';
import { Copy, Globe, RefreshCw, Search, MapPin } from 'lucide-react';
import { Card, CardContent } from './Card';
import { saveGeneratedData, checkDataExists } from '../utils/dataStorage';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';
import DuplicateStatus from './DuplicateStatus';

export default function IpFinder() {
  const [myIp, setMyIp] = useState('Loading...');
  const [loading, setLoading] = useState(false);

  // IP to Address states
  const [searchIp, setSearchIp] = useState('');
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressData, setAddressData] = useState(null);
  const [addressError, setAddressError] = useState('');

  const { addGeneratedData } = useAppData();
  const { addToast } = useToast();

  useEffect(() => {
    fetchMyIp();
  }, []);

  const fetchMyIp = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      setMyIp(data.ip);
    } catch (error) {
      setMyIp('Unable to fetch IP');
      addToast('Failed to fetch IP address', 'error');
    }
    setLoading(false);
  };

  const searchIpAddress = async () => {
    if (!searchIp.trim()) {
      setAddressError('Please enter an IP address');
      return;
    }

    // Basic IP validation
    const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipRegex.test(searchIp.trim())) {
      setAddressError('Please enter a valid IPv4 address (e.g., 8.8.8.8)');
      return;
    }

    setAddressError('');
    setAddressLoading(true);
    setAddressData(null);

    const startTime = performance.now(); // Track search start time

    try {
      // Using ip-api.com - free, no API key required, real-time data
      const response = await fetch(`https://ipapi.co/${searchIp.trim()}/json/`);
      const data = await response.json();

      if (data.error) {
        setAddressError(data.reason || 'Failed to fetch location data');
        setAddressData(null);
        addToast('Failed to lookup IP address', 'error');
      } else {
        // Map ipapi.co response to match our existing structure
        const mappedData = {
          query: data.ip,
          country: data.country_name,
          countryCode: data.country_code,
          region: data.region_code,
          regionName: data.region,
          city: data.city,
          zip: data.postal,
          lat: data.latitude,
          lon: data.longitude,
          timezone: data.timezone,
          isp: data.org,
          org: data.org,
          as: data.asn
        };
        setAddressData(mappedData);
        
        // Calculate and emit search time
        const endTime = performance.now();
        const searchTime = (endTime - startTime) / 1000; // Convert to seconds
        
        // Emit generation complete event with timing
        window.dispatchEvent(new CustomEvent('generationComplete', {
          detail: { generationTime: searchTime, type: 'ip', count: 1 }
        }));
        
        addToast('IP location found successfully!', 'success');

        // Save to database if user is logged in
        if (user) {
          try {
            // Check if this IP lookup already exists
            const exists = await checkDataExists('ip', searchIp.trim(), {
              type: 'ip_lookup'
            });
            
            if (!exists) {
              await saveGeneratedData('ip', searchIp.trim(), {
                type: 'ip_lookup',
                country: mappedData.country,
                city: mappedData.city,
                region: mappedData.regionName,
                isp: mappedData.isp,
                timezone: mappedData.timezone,
                coordinates: `${mappedData.lat}, ${mappedData.lon}`
              }, addGeneratedData);
            } else {
              console.log('IP lookup already exists in database:', searchIp.trim());
            }
          } catch (error) {
            console.error('Error saving IP lookup data:', error);
          }
        }
      }
    } catch (error) {
      setAddressError('Network error. Please try again.');
      setAddressData(null);
      addToast('Network error during IP lookup', 'error');
    } finally {
      setAddressLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    addToast('Copied to clipboard!', 'success');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900/20 to-slate-900">
      <div className="p-4 md:p-6 space-y-6">
        {/* Modern Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-green-600/10 via-emerald-600/10 to-teal-600/10 backdrop-blur-xl rounded-3xl border border-green-500/20 p-6 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 via-transparent to-teal-600/5"></div>
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/25">
                <Globe size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  IP Address Finder
                </h1>
                <p className="text-slate-400 mt-1">Find your IP and lookup detailed location information</p>
              </div>
            </div>
          </div>
        </div>

        {/* Duplicate Prevention Status */}
        <DuplicateStatus dataType="ip" />

        <Card className="w-full flex flex-col shadow-2xl bg-slate-800/50 backdrop-blur-xl border-slate-700/50">
          <CardContent className="p-6">
            <div className="space-y-8">
              {/* My IP Section - Modern */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                    Your IP Address
                  </h3>
                  <button
                    onClick={fetchMyIp}
                    disabled={loading}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/50 hover:border-green-500/30 text-slate-300 hover:text-white rounded-lg transition-all duration-200 text-sm"
                  >
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                    Refresh
                  </button>
                </div>

                <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-sm rounded-2xl border border-green-500/30 p-6 shadow-lg shadow-green-500/25">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-xs text-green-300 uppercase tracking-wider font-medium">Current IP Address</p>
                      <p className="font-mono text-2xl md:text-3xl font-bold text-white tracking-wide">
                        {myIp}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopy(myIp)}
                      disabled={myIp === 'Loading...' || myIp === 'Unable to fetch IP'}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Copy size={16} />
                      Copy
                    </button>
                  </div>
                </div>
              </div>

              {/* IP Lookup Section - Modern */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    IP Location Lookup
                  </h3>
                  <span className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    Real-time Data
                  </span>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 space-y-4">
                  <p className="text-sm text-slate-400">
                    Enter any IP address to discover its real-time location and network details
                  </p>

                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Enter IP address (e.g., 8.8.8.8)"
                      value={searchIp}
                      onChange={(e) => setSearchIp(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && searchIpAddress()}
                      className="flex-1 h-12 rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-slate-100 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    />
                    <button
                      onClick={searchIpAddress}
                      disabled={addressLoading}
                      className="h-12 px-6 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-lg transition-all duration-200 font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {addressLoading ? (
                        <>
                          <RefreshCw size={16} className="animate-spin" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search size={16} />
                          Search
                        </>
                      )}
                    </button>
                  </div>

                  {addressError && (
                    <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm">
                      {addressError}
                    </div>
                  )}
                </div>
              </div>

              {/* No Data Message - Modern Empty State */}
              {!addressData && !addressLoading && !addressError && (
                <div className="mt-8 text-center py-16">
                  <div className="relative">
                    <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center border border-green-500/30">
                      <span className="text-6xl">🌐</span>
                    </div>
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-green-500/10 to-emerald-500/10 animate-pulse"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-300 mb-3">Ready to Lookup</h3>
                  <p className="text-slate-400 max-w-md mx-auto">
                    Enter an IP address above and click search to get detailed location information
                  </p>
                </div>
              )}

              {/* Results Section - Modern */}
              {addressData && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></span>
                      Location Details
                    </h3>
                    <span className="text-sm text-slate-400">
                      IP: {addressData.query}
                    </span>
                  </div>

                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl">
                    <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 px-6 py-4 border-b border-slate-700/50">
                      <h4 className="font-semibold text-slate-100 text-lg flex items-center gap-2">
                        <MapPin size={20} className="text-green-400" />
                        Location Information
                      </h4>
                    </div>

                    <div className="divide-y divide-slate-700/50">
                      {/* Full Address Row */}
                      <div className="flex justify-between items-center px-6 py-4 hover:bg-slate-700/30 transition-colors">
                        <span className="text-sm font-medium text-slate-300">Full Address</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono text-slate-100 text-right">
                            {addressData.city && `${addressData.city}, `}
                            {addressData.regionName && `${addressData.regionName}, `}
                            {addressData.country}
                            {addressData.zip && ` ${addressData.zip}`}
                          </span>
                          <button
                            onClick={() => handleCopy(`${addressData.city ? addressData.city + ', ' : ''}${addressData.regionName ? addressData.regionName + ', ' : ''}${addressData.country}${addressData.zip ? ' ' + addressData.zip : ''}`)}
                            className="p-1.5 rounded-lg hover:bg-slate-600/50 text-slate-400 hover:text-white transition-colors"
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center px-6 py-4 hover:bg-slate-700/30 transition-colors">
                        <span className="text-sm font-medium text-slate-300">Country</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono text-slate-100">
                            {addressData.country} ({addressData.countryCode})
                          </span>
                          <button
                            onClick={() => handleCopy(addressData.country)}
                            className="p-1.5 rounded-lg hover:bg-slate-600/50 text-slate-400 hover:text-white transition-colors"
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center px-6 py-4 hover:bg-slate-700/30 transition-colors">
                        <span className="text-sm font-medium text-slate-300">Region</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono text-slate-100">
                            {addressData.regionName} ({addressData.region})
                          </span>
                          <button
                            onClick={() => handleCopy(addressData.regionName)}
                            className="p-1.5 rounded-lg hover:bg-slate-600/50 text-slate-400 hover:text-white transition-colors"
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center px-6 py-4 hover:bg-slate-700/30 transition-colors">
                        <span className="text-sm font-medium text-slate-300">City</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono text-slate-100">{addressData.city}</span>
                          <button
                            onClick={() => handleCopy(addressData.city)}
                            className="p-1.5 rounded-lg hover:bg-slate-600/50 text-slate-400 hover:text-white transition-colors"
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                      </div>

                      {addressData.zip && (
                        <div className="flex justify-between items-center px-6 py-4 hover:bg-slate-700/30 transition-colors">
                          <span className="text-sm font-medium text-slate-300">Postal Code</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-mono text-slate-100">{addressData.zip}</span>
                            <button
                              onClick={() => handleCopy(addressData.zip)}
                              className="p-1.5 rounded-lg hover:bg-slate-600/50 text-slate-400 hover:text-white transition-colors"
                            >
                              <Copy size={14} />
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center px-6 py-4 hover:bg-slate-700/30 transition-colors">
                        <span className="text-sm font-medium text-slate-300">Coordinates</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono text-slate-100">
                            {addressData.lat}, {addressData.lon}
                          </span>
                          <button
                            onClick={() => handleCopy(`${addressData.lat}, ${addressData.lon}`)}
                            className="p-1.5 rounded-lg hover:bg-slate-600/50 text-slate-400 hover:text-white transition-colors"
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center px-6 py-4 hover:bg-slate-700/30 transition-colors">
                        <span className="text-sm font-medium text-slate-300">Timezone</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono text-slate-100">{addressData.timezone}</span>
                          <button
                            onClick={() => handleCopy(addressData.timezone)}
                            className="p-1.5 rounded-lg hover:bg-slate-600/50 text-slate-400 hover:text-white transition-colors"
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center px-6 py-4 hover:bg-slate-700/30 transition-colors">
                        <span className="text-sm font-medium text-slate-300">ISP</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono text-slate-100">{addressData.isp}</span>
                          <button
                            onClick={() => handleCopy(addressData.isp)}
                            className="p-1.5 rounded-lg hover:bg-slate-600/50 text-slate-400 hover:text-white transition-colors"
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                      </div>

                      {addressData.org && (
                        <div className="flex justify-between items-center px-6 py-4 hover:bg-slate-700/30 transition-colors">
                          <span className="text-sm font-medium text-slate-300">Organization</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-mono text-slate-100">{addressData.org}</span>
                            <button
                              onClick={() => handleCopy(addressData.org)}
                              className="p-1.5 rounded-lg hover:bg-slate-600/50 text-slate-400 hover:text-white transition-colors"
                            >
                              <Copy size={14} />
                            </button>
                          </div>
                        </div>
                      )}

                      {addressData.as && (
                        <div className="flex justify-between items-center px-6 py-4 hover:bg-slate-700/30 transition-colors">
                          <span className="text-sm font-medium text-slate-300">AS Number</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-mono text-slate-100">{addressData.as}</span>
                            <button
                              onClick={() => handleCopy(addressData.as)}
                              className="p-1.5 rounded-lg hover:bg-slate-600/50 text-slate-400 hover:text-white transition-colors"
                            >
                              <Copy size={14} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 px-6 py-4 border-t border-slate-700/50">
                      <a
                        href={`https://www.google.com/maps?q=${addressData.lat},${addressData.lon}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-green-300 hover:text-green-200 font-medium transition-colors"
                      >
                        <MapPin size={16} />
                        View Location on Google Maps
                      </a>
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
