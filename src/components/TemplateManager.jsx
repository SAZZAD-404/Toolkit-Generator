import { useState } from 'react';
import { Save, FolderOpen, Trash2, X, ChevronDown } from 'lucide-react';
import { Button } from './Button';
import { useTemplates, isValidTemplateName } from '../context/TemplateContext';
import { useToast } from '../context/ToastContext';

function SaveTemplateModal({ isOpen, onClose, onSave }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!isValidTemplateName(name)) {
      setError('Please enter a valid template name');
      return;
    }
    onSave(name.trim());
    setName('');
    setError('');
    onClose();
  };

  const handleClose = () => {
    setName('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-slate-800 border border-slate-600 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl animate-fadeIn">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-100">Save Template</h3>
          <button
            onClick={handleClose}
            className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Template Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="Enter template name..."
              className="w-full h-10 rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
            {error && (
              <p className="text-xs text-red-400 mt-1">{error}</p>
            )}
          </div>
          
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save size={16} className="mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


function TemplateDropdown({ templates, onSelect, onDelete, isOpen, onToggle }) {
  if (templates.length === 0) {
    return (
      <div className="text-sm text-slate-500 italic py-2 px-3 bg-slate-700/30 rounded-lg border border-slate-600">
        No saved templates
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between h-10 px-3 rounded-md border border-slate-600 bg-slate-700 text-sm text-slate-100 hover:bg-slate-600 transition-colors"
      >
        <span className="flex items-center gap-2">
          <FolderOpen size={16} className="text-indigo-400" />
          Select Template ({templates.length})
        </span>
        <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-10 max-h-60 overflow-y-auto scrollbar-thin">
          {templates.map((template) => (
            <div
              key={template.id}
              className="flex items-center justify-between px-3 py-2 hover:bg-slate-700 transition-colors group"
            >
              <button
                onClick={() => onSelect(template)}
                className="flex-1 text-left text-sm text-slate-200 hover:text-white"
              >
                <span className="font-medium">{template.name}</span>
                <span className="text-xs text-slate-500 ml-2">
                  {new Date(template.createdAt).toLocaleDateString()}
                </span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(template.id);
                }}
                className="p-1.5 rounded hover:bg-red-600/20 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                title="Delete template"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TemplateManager({ generatorType, currentConfig, onLoadTemplate }) {
  const { saveTemplate, deleteTemplate, getTemplatesByType } = useTemplates();
  const { addToast } = useToast();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const templates = getTemplatesByType(generatorType);

  const handleSaveTemplate = (name) => {
    const success = saveTemplate(name, generatorType, currentConfig);
    if (success) {
      addToast(`Template "${name}" saved successfully`, 'success');
    } else {
      addToast('Failed to save template. Please try again.', 'error');
    }
  };

  const handleLoadTemplate = (template) => {
    if (template && template.config) {
      onLoadTemplate(template.config);
      setDropdownOpen(false);
      addToast(`Template "${template.name}" loaded`, 'success');
    }
  };

  const handleDeleteTemplate = (id) => {
    const template = templates.find(t => t.id === id);
    deleteTemplate(id);
    if (template) {
      addToast(`Template "${template.name}" deleted`, 'success');
    }
  };

  return (
    <div className="space-y-3 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
          <FolderOpen size={16} className="text-indigo-400" />
          Templates
        </h4>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSaveModal(true)}
          className="gap-1"
        >
          <Save size={14} />
          Save Current
        </Button>
      </div>

      <TemplateDropdown
        templates={templates}
        onSelect={handleLoadTemplate}
        onDelete={handleDeleteTemplate}
        isOpen={dropdownOpen}
        onToggle={() => setDropdownOpen(!dropdownOpen)}
      />

      <SaveTemplateModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSaveTemplate}
      />
    </div>
  );
}
