import React, { useState, useEffect } from 'react';
import { Copy, Globe, RefreshCw, Search, MapPin } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './Card';
import { Button } from './Button';
import { useStats } from '../context/StatsContext';

export default function IpFinder() {
  const [myIp, setMyIp] = useState('Loading...');
  const [loading, setLoading] = useState(false);

  // IP to Address states
  const [searchIp, setSearchIp] = useState('');
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressData, setAddressData] = useState(null);
  const [addressError, setAddressError] = useState('');
  const { recordGeneration } = useStats();

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

    try {
      // Using ip-api.com - free, no API key required, real-time data
      const response = await fetch(`https://ipapi.co/${searchIp.trim()}/json/`);
      const data = await response.json();

      if (data.error) {
        setAddressError(data.reason || 'Failed to fetch location data');
        setAddressData(null);
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
        // Record statistics for successful IP lookup
        recordGeneration('ipfinder', 1);
      }
    } catch (error) {
      setAddressError('Network error. Please try again.');
      setAddressData(null);
    } finally {
      setAddressLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🌐</span>
          IP Address Finder
        </CardTitle>
        <CardDescription>
          Find your IP address and lookup detailed location information for any IP
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-8">
          {/* My IP Section - Enhanced */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
                <Globe size={22} className="text-indigo-400" />
                Your IP Address
              </h3>
              <Button
                size="sm"
                variant="outline"
                onClick={fetchMyIp}
                disabled={loading}
                className="gap-2"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                Refresh
              </Button>
            </div>

            <div className="relative">
              <div className="p-6 bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-lg border-2 border-indigo-500/30 shadow-lg shadow-indigo-900/20">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Current IP Address</p>
                    <p className="font-mono text-2xl md:text-3xl font-bold text-slate-100 tracking-wide">
                      {myIp}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handleCopy(myIp)}
                    disabled={myIp === 'Loading...' || myIp === 'Unable to fetch IP'}
                    className="gap-2"
                  >
                    <Copy size={16} />
                    Copy
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* IP to Address Lookup Section - Enhanced */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
                <MapPin size={22} className="text-indigo-400" />
                IP Location Lookup
              </h3>
              <p className="text-sm text-slate-400">
                Enter any IP address to discover its real-time location and network details
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter IP address (e.g., 8.8.8.8)"
                value={searchIp}
                onChange={(e) => setSearchIp(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchIpAddress()}
                className="flex-1 h-10 rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 ring-offset-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
              />
              <Button
                onClick={searchIpAddress}
                disabled={addressLoading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
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
              </Button>
            </div>

            {addressError && (
              <div className="p-3 bg-red-900/30 border border-red-700 rounded-md text-red-300 text-sm">
                {addressError}
              </div>
            )}

            {addressData && (
              <div className="border-2 border-indigo-500/30 rounded-lg overflow-hidden shadow-lg shadow-indigo-900/20 bg-slate-800/50">
                <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 px-5 py-3 border-b border-indigo-500/30">
                  <h4 className="font-semibold text-slate-100 text-lg">Location Details for {addressData.query}</h4>
                </div>

                <div className="divide-y">
                  {/* Full Address Row */}
                  <div className="flex justify-between items-center px-4 py-3 hover:bg-slate-700/30 bg-slate-700/20">
                    <span className="text-sm font-medium text-slate-300">Full Address</span>
                    <span className="text-sm font-mono text-slate-100 flex items-center gap-2 text-right">
                      {addressData.city && `${addressData.city}, `}
                      {addressData.regionName && `${addressData.regionName}, `}
                      {addressData.country}
                      {addressData.zip && ` ${addressData.zip}`}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopy(`${addressData.city ? addressData.city + ', ' : ''}${addressData.regionName ? addressData.regionName + ', ' : ''}${addressData.country}${addressData.zip ? ' ' + addressData.zip : ''}`)}
                      >
                        <Copy size={12} />
                      </Button>
                    </span>
                  </div>

                  <div className="flex justify-between items-center px-4 py-3 hover:bg-slate-700/30">
                    <span className="text-sm font-medium text-slate-300">Country</span>
                    <span className="text-sm font-mono text-slate-100 flex items-center gap-2">
                      {addressData.country} ({addressData.countryCode})
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopy(addressData.country)}
                      >
                        <Copy size={12} />
                      </Button>
                    </span>
                  </div>
                  <div className="flex justify-between items-center px-4 py-3 hover:bg-slate-700/30">
                    <span className="text-sm font-medium text-slate-300">Region</span>
                    <span className="text-sm font-mono text-slate-100 flex items-center gap-2">
                      {addressData.regionName} ({addressData.region})
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopy(addressData.regionName)}
                      >
                        <Copy size={12} />
                      </Button>
                    </span>
                  </div>
                  <div className="flex justify-between items-center px-4 py-3 hover:bg-slate-700/30">
                    <span className="text-sm font-medium text-slate-300">City</span>
                    <span className="text-sm font-mono text-slate-100 flex items-center gap-2">
                      {addressData.city}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopy(addressData.city)}
                      >
                        <Copy size={12} />
                      </Button>
                    </span>
                  </div>
                  {addressData.zip && (
                    <div className="flex justify-between items-center px-4 py-3 hover:bg-slate-700/30">
                      <span className="text-sm font-medium text-slate-300">Postal Code</span>
                      <span className="text-sm font-mono text-slate-100 flex items-center gap-2">
                        {addressData.zip}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopy(addressData.zip)}
                        >
                          <Copy size={12} />
                        </Button>
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center px-4 py-3 hover:bg-slate-700/30">
                    <span className="text-sm font-medium text-slate-300">Coordinates</span>
                    <span className="text-sm font-mono text-slate-100 flex items-center gap-2">
                      {addressData.lat}, {addressData.lon}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopy(`${addressData.lat}, ${addressData.lon}`)}
                      >
                        <Copy size={12} />
                      </Button>
                    </span>
                  </div>
                  <div className="flex justify-between items-center px-4 py-3 hover:bg-slate-700/30">
                    <span className="text-sm font-medium text-slate-300">Timezone</span>
                    <span className="text-sm font-mono text-slate-100 flex items-center gap-2">
                      {addressData.timezone}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopy(addressData.timezone)}
                      >
                        <Copy size={12} />
                      </Button>
                    </span>
                  </div>
                  <div className="flex justify-between items-center px-4 py-3 hover:bg-slate-700/30">
                    <span className="text-sm font-medium text-slate-300">ISP</span>
                    <span className="text-sm font-mono text-slate-100 flex items-center gap-2">
                      {addressData.isp}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopy(addressData.isp)}
                      >
                        <Copy size={12} />
                      </Button>
                    </span>
                  </div>
                  {addressData.org && (
                    <div className="flex justify-between items-center px-4 py-3 hover:bg-slate-700/30">
                      <span className="text-sm font-medium text-slate-300">Organization</span>
                      <span className="text-sm font-mono text-slate-100 flex items-center gap-2">
                        {addressData.org}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopy(addressData.org)}
                        >
                          <Copy size={12} />
                        </Button>
                      </span>
                    </div>
                  )}
                  {addressData.as && (
                    <div className="flex justify-between items-center px-4 py-3 hover:bg-slate-700/30">
                      <span className="text-sm font-medium text-slate-300">AS Number</span>
                      <span className="text-sm font-mono text-slate-100 flex items-center gap-2">
                        {addressData.as}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopy(addressData.as)}
                        >
                          <Copy size={12} />
                        </Button>
                      </span>
                    </div>
                  )}
                </div>
                <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 px-5 py-4 border-t border-indigo-500/30">
                  <a
                    href={`https://www.google.com/maps?q=${addressData.lat},${addressData.lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-indigo-300 hover:text-indigo-200 font-medium transition-colors"
                  >
                    <MapPin size={16} />
                    View Location on Google Maps
                  </a>
                </div>
              </div>
            )}
          </div>


        </div>
      </CardContent>
    </Card>
  );
}
