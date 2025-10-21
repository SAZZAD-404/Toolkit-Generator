import React, { useState } from 'react';
import { Mail, Smartphone, Globe, Hash } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/Tabs';
import GmailGenerator from './components/GmailGenerator';
import UserAgentGenerator from './components/UserAgentGenerator';
import IpFinder from './components/IpFinder';
import NumberGenerator from './components/NumberGenerator';
import Footer from './components/Footer';

function App() {
  const [activeTab, setActiveTab] = useState('gmail');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <header className="w-full py-6 md:py-8 bg-slate-900/95 shadow-lg shadow-black/20 border-b border-slate-700 sticky top-0 z-50 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
              Toolkit Generators
            </h1>
            <p className="text-sm text-slate-400 font-medium">
              Professional tools for cpa
            </p>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6 md:mb-8 p-1 bg-slate-800 shadow-lg shadow-black/30 border border-slate-700">
            <TabsTrigger value="gmail" className="flex items-center justify-center gap-2">
              <Mail size={18} />
              <span className="hidden sm:inline">Gmail Generator</span>
              <span className="sm:hidden">Gmail</span>
            </TabsTrigger>
            <TabsTrigger value="useragent" className="flex items-center justify-center gap-2">
              <Smartphone size={18} />
              <span className="hidden sm:inline">User Agent</span>
              <span className="sm:hidden">Agent</span>
            </TabsTrigger>
            <TabsTrigger value="ipfinder" className="flex items-center justify-center gap-2">
              <Globe size={18} />
              <span className="hidden sm:inline">IP Finder</span>
              <span className="sm:hidden">IP</span>
            </TabsTrigger>
            <TabsTrigger value="numbergenerator" className="flex items-center justify-center gap-2">
              <Hash size={18} />
              <span className="hidden sm:inline">Number Generator</span>
              <span className="sm:hidden">Number</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gmail" className="mt-0">
            <GmailGenerator />
          </TabsContent>

          <TabsContent value="useragent" className="mt-0">
            <UserAgentGenerator />
          </TabsContent>

          <TabsContent value="ipfinder" className="mt-0">
            <IpFinder />
          </TabsContent>

          <TabsContent value="numbergenerator" className="mt-0">
            <NumberGenerator />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}

export default App;
