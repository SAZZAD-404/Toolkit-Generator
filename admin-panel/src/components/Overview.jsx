import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Users, Mail, Phone, TrendingUp } from 'lucide-react';

export default function Overview() {
  const [stats, setStats] = useState({
    userAgents: 0,
    emailDomains: 0,
    phoneCodes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [userAgentsRes, emailDomainsRes, phoneCodesRes] = await Promise.all([
        supabase.from('user_agents').select('*', { count: 'exact', head: true }),
        supabase.from('email_domains').select('*', { count: 'exact', head: true }),
        supabase.from('phone_area_codes').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        userAgents: userAgentsRes.count || 0,
        emailDomains: emailDomainsRes.count || 0,
        phoneCodes: phoneCodesRes.count || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: 'User Agents',
      value: stats.userAgents,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Email Domains',
      value: stats.emailDomains,
      icon: Mail,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Phone Codes',
      value: stats.phoneCodes,
      icon: Phone,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">Manage your toolkit generators data</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${card.bgColor}`}>
                  <Icon className={`w-6 h-6 ${card.textColor}`} />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{card.title}</h3>
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition text-left">
            <Users className="w-6 h-6 text-indigo-600 mb-2" />
            <p className="font-medium text-gray-900">Add User Agent</p>
            <p className="text-sm text-gray-600">Create new user agent entry</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition text-left">
            <Mail className="w-6 h-6 text-green-600 mb-2" />
            <p className="font-medium text-gray-900">Add Email Domain</p>
            <p className="text-sm text-gray-600">Create new email domain</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition text-left">
            <Phone className="w-6 h-6 text-purple-600 mb-2" />
            <p className="font-medium text-gray-900">Add Phone Code</p>
            <p className="text-sm text-gray-600">Create new area code</p>
          </button>
        </div>
      </div>
    </div>
  );
}
