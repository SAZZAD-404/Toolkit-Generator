import React, { useState } from 'react';
import { Mail, Smartphone, Globe, Hash, LogOut, User, ChevronDown } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs';
import GmailGenerator from './GmailGenerator';
import UserAgentGenerator from './UserAgentGenerator';
import IpFinder from './IpFinder';
import NumberGenerator from './NumberGenerator';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext';
import { Button } from './Button';

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('gmail');
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { userProfile, signOut } = useAuth();

    const handleSignOut = async () => {
        await signOut();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
            <header className="w-full py-6 md:py-8 bg-slate-900/95 shadow-lg shadow-black/20 border-b border-slate-700 sticky top-0 z-50 backdrop-blur-md">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* Title */}
                        <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
                                Toolkit Generators
                            </h1>
                            <p className="text-sm text-slate-400 font-medium">
                                Professional tools for CPA
                            </p>
                        </div>

                        {/* User Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-3 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                                    <User size={18} className="text-white" />
                                </div>
                                <div className="text-left hidden sm:block">
                                    <p className="text-sm font-medium text-slate-200">
                                        {userProfile?.name || 'User'}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        {userProfile?.email}
                                    </p>
                                </div>
                                <ChevronDown
                                    size={18}
                                    className={`text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
                                />
                            </button>

                            {/* Dropdown Menu */}
                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden animate-fadeIn">
                                    <div className="p-4 border-b border-slate-700">
                                        <p className="text-sm font-medium text-slate-200 mb-1">
                                            {userProfile?.name}
                                        </p>
                                        <p className="text-xs text-slate-400 truncate">
                                            {userProfile?.email}
                                        </p>
                                        <div className="mt-2">
                                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                                                Active Account
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-2">
                                        <button
                                            onClick={handleSignOut}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                        >
                                            <LogOut size={16} />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
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
