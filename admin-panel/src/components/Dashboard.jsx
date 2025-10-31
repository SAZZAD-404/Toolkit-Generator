import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { LogOut, Users, Mail, Phone, LayoutDashboard, Code } from 'lucide-react';
import UserAgentsManager from './UserAgentsManager';
import EmailDomainsManager from './EmailDomainsManager';
import PhoneCodesManager from './PhoneCodesManager';
import Overview from './Overview';
import CodeEditor from './CodeEditor';

export default function Dashboard({ session }) {
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'user-agents', label: 'User Agents', icon: Users },
    { id: 'email-domains', label: 'Email Domains', icon: Mail },
    { id: 'phone-codes', label: 'Phone Codes', icon: Phone },
    { id: 'code-editor', label: 'Code Editor', icon: Code },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-sm text-gray-600">Toolkit Generators Management</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{session.user.email}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition ${
                    activeTab === tab.id
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && <Overview />}
        {activeTab === 'user-agents' && <UserAgentsManager />}
        {activeTab === 'email-domains' && <EmailDomainsManager />}
        {activeTab === 'phone-codes' && <PhoneCodesManager />}
        {activeTab === 'code-editor' && <CodeEditor />}
      </main>
    </div>
  );
}
