import { useState } from 'react';
import { 
  MoreVertical, Download, Share2, Bookmark, RefreshCw, 
  Settings, HelpCircle, Zap, ExternalLink
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export function QuickActions({ activeTab, isOpen, setIsOpen }) {
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const getQuickActions = (tab) => {
    const commonActions = [
      {
        id: 'refresh',
        name: 'Refresh Page',
        icon: RefreshCw,
        color: 'text-blue-400',
        action: async () => {
          addToast('Refreshing page...', 'info');
          setTimeout(() => window.location.reload(), 500);
        }
      },
      {
        id: 'bookmark',
        name: 'Bookmark Page',
        icon: Bookmark,
        color: 'text-yellow-400',
        action: async () => {
          try {
            // Try to add bookmark
            if (window.external && window.external.AddFavorite) {
              window.external.AddFavorite(window.location.href, document.title);
            } else {
              // Fallback - copy URL to clipboard
              await navigator.clipboard.writeText(window.location.href);
              addToast('URL copied to clipboard! You can bookmark it manually.', 'success');
            }
          } catch (error) {
            addToast('Please bookmark this page manually (Ctrl+D)', 'info');
          }
        }
      },
      {
        id: 'share',
        name: 'Share Page',
        icon: Share2,
        color: 'text-green-400',
        action: async () => {
          try {
            if (navigator.share) {
              await navigator.share({
                title: 'CPA Toolkit Pro',
                text: 'Check out this professional CPA toolkit!',
                url: window.location.href
              });
              addToast('Shared successfully!', 'success');
            } else {
              // Fallback - copy URL
              await navigator.clipboard.writeText(window.location.href);
              addToast('URL copied to clipboard!', 'success');
            }
          } catch (error) {
            addToast('Sharing cancelled', 'info');
          }
        }
      },
      {
        id: 'help',
        name: 'Help & Support',
        icon: HelpCircle,
        color: 'text-purple-400',
        action: async () => {
          addToast('Opening help documentation...', 'info');
          // You can replace this with actual help URL
          window.open('https://github.com/your-repo/help', '_blank');
        }
      }
    ];

    const generatorActions = [
      {
        id: 'clear-results',
        name: 'Clear Results',
        icon: RefreshCw,
        color: 'text-orange-400',
        action: async () => {
          // Trigger clear results for current generator
          const clearButton = document.querySelector('button:contains("Clear")') || 
                             document.querySelector('[data-action="clear"]');
          if (clearButton) {
            clearButton.click();
            addToast('Results cleared!', 'success');
          } else {
            addToast('No results to clear', 'info');
          }
        }
      },
      {
        id: 'export',
        name: 'Export Results',
        icon: Download,
        color: 'text-cyan-400',
        action: async () => {
          // Try to find and click export/copy all button
          const exportButton = document.querySelector('button:contains("Copy All")') || 
                               document.querySelector('button:contains("Export")') ||
                               document.querySelector('[data-action="export"]');
          if (exportButton) {
            exportButton.click();
            addToast('Export initiated!', 'success');
          } else {
            addToast('No data to export', 'info');
          }
        }
      },
      ...commonActions
    ];

    const managementActions = [
      {
        id: 'export-all',
        name: 'Export All Data',
        icon: Download,
        color: 'text-cyan-400',
        action: async () => {
          addToast('Preparing data export...', 'info');
          // Trigger export all functionality
          setTimeout(() => {
            addToast('Export feature coming soon!', 'info');
          }, 1000);
        }
      },
      ...commonActions
    ];

    if (['gmail', 'useragent', 'ipfinder', 'numbergenerator'].includes(tab)) {
      return generatorActions;
    }
    
    return managementActions;
  };

  const actions = getQuickActions(activeTab);

  const handleAction = async (actionFn) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      await actionFn();
    } catch (error) {
      console.error('Action failed:', error);
      addToast('Action failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 rounded-lg text-slate-300 hover:text-white transition-all duration-200 ${
          isOpen ? 'bg-slate-700/50 text-white' : ''
        }`}
      >
        <MoreVertical className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
        <span className="hidden sm:inline">Actions</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-64 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
            <div className="p-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-2 flex items-center gap-2">
                <Zap className="w-3 h-3" />
                Quick Actions
              </div>
              
              <div className="space-y-1">
                {actions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={() => handleAction(action.action)}
                      disabled={isLoading}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-slate-700/50 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className={`p-1.5 rounded-lg bg-slate-700/50 group-hover:bg-slate-600/50 transition-colors ${action.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                          {action.name}
                        </div>
                      </div>
                      {isLoading && (
                        <div className="w-4 h-4 border-2 border-slate-600 border-t-indigo-400 rounded-full animate-spin" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="border-t border-slate-700/50 p-2">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-slate-300 transition-colors rounded-lg hover:bg-slate-700/30"
              >
                <ExternalLink className="w-4 h-4" />
                Close Menu
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}