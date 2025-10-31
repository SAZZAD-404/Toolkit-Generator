import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Code, Save, RotateCcw, AlertTriangle, CheckCircle, History, Eye, Maximize2, Minimize2, Upload, Trash2, Plus } from 'lucide-react';
import Editor from '@monaco-editor/react';
import FileExplorer from './FileExplorer';

export default function CodeEditor() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [code, setCode] = useState('');
  const [originalCode, setOriginalCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [loadingFromGitHub, setLoadingFromGitHub] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({ fileName: '', filePath: '', fileType: 'javascript' });
  const autoSaveTimerRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    setHasChanges(code !== originalCode);
    
    // Auto-save after 3 seconds of no typing
    if (code !== originalCode && selectedFile) {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      
      autoSaveTimerRef.current = setTimeout(() => {
        autoSave();
      }, 3000);
    }
    
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [code, originalCode]);

  const autoSave = async () => {
    if (!selectedFile || code === originalCode) return;
    
    // Validate before auto-save
    const error = validateCode(code);
    if (error) {
      console.log('Auto-save skipped due to validation error');
      return;
    }

    setAutoSaving(true);

    try {
      const { data: session } = await supabase.auth.getSession();
      const userEmail = session?.session?.user?.email || 'unknown';

      const { error: updateError } = await supabase
        .from('code_files')
        .update({
          file_content: code,
          updated_by: userEmail,
        })
        .eq('id', selectedFile.id);

      if (updateError) throw updateError;

      setOriginalCode(code);
      setLastSaved(new Date());
      console.log('✅ Auto-saved successfully');
    } catch (error) {
      console.error('Auto-save error:', error);
    } finally {
      setAutoSaving(false);
    }
  };

  const fetchFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('code_files')
        .select('*')
        .order('file_name');

      if (error) throw error;
      setFiles(data || []);
      if (data && data.length > 0 && !selectedFile) {
        selectFile(data[0]);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
      alert('Error loading files: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const selectFile = (file) => {
    if (hasChanges) {
      if (!confirm('You have unsaved changes. Discard them?')) {
        return;
      }
    }
    setSelectedFile(file);
    setCode(file.file_content);
    setOriginalCode(file.file_content);
    setValidationError('');
    setShowHistory(false);
  };

  const validateCode = (codeStr) => {
    try {
      // Basic syntax check using Function constructor
      new Function(codeStr);
      
      // Check for dangerous patterns
      const dangerousPatterns = [
        /eval\s*\(/,
        /Function\s*\(/,
        /setTimeout\s*\(\s*["'`]/,
        /setInterval\s*\(\s*["'`]/,
        /<script/i,
        /document\.write/,
        /innerHTML\s*=/,
      ];

      for (const pattern of dangerousPatterns) {
        if (pattern.test(codeStr)) {
          return `Dangerous code pattern detected: ${pattern.source}. This is not allowed for security reasons.`;
        }
      }

      return null;
    } catch (error) {
      return `Syntax Error: ${error.message}`;
    }
  };

  const handleSave = async () => {
    // Validation
    const error = validateCode(code);
    if (error) {
      setValidationError(error);
      return;
    }

    if (!confirm('Are you sure you want to save these changes? This will update the live code.')) {
      return;
    }

    setSaving(true);
    setValidationError('');

    try {
      const { data: session } = await supabase.auth.getSession();
      const userEmail = session?.session?.user?.email || 'unknown';

      const { error: updateError } = await supabase
        .from('code_files')
        .update({
          file_content: code,
          updated_by: userEmail,
        })
        .eq('id', selectedFile.id);

      if (updateError) throw updateError;

      setOriginalCode(code);
      alert('✅ Code saved successfully! Backup created automatically.');
      fetchFiles();
    } catch (error) {
      console.error('Error saving code:', error);
      alert('Error saving code: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset to original code? All changes will be lost.')) {
      setCode(originalCode);
      setValidationError('');
    }
  };

  const fetchHistory = async () => {
    if (!selectedFile) return;

    try {
      const { data, error } = await supabase
        .from('code_file_history')
        .select('*')
        .eq('file_id', selectedFile.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setHistory(data || []);
      setShowHistory(true);
    } catch (error) {
      console.error('Error fetching history:', error);
      alert('Error loading history: ' + error.message);
    }
  };

  const restoreVersion = async (historyItem) => {
    if (!confirm(`Restore version ${historyItem.version}? Current code will be backed up.`)) {
      return;
    }

    setCode(historyItem.file_content);
    setShowHistory(false);
    alert('Version restored. Click Save to apply changes.');
  };

  const loadFromGitHub = async () => {
    if (!selectedFile) return;

    if (!confirm('Load latest code from GitHub repository? This will replace current content.')) {
      return;
    }

    setLoadingFromGitHub(true);

    try {
      // GitHub raw URL for your repository
      const githubUrl = `https://raw.githubusercontent.com/SAZZAD-404/Toolkit-Generators/main/${selectedFile.file_path}`;
      
      const response = await fetch(githubUrl);
      
      if (!response.ok) {
        throw new Error('Failed to fetch from GitHub. Make sure the file exists in your repository.');
      }

      const content = await response.text();
      setCode(content);
      alert('✅ Code loaded from GitHub successfully! Review and click Save to update database.');
    } catch (error) {
      console.error('Error loading from GitHub:', error);
      alert('Error loading from GitHub: ' + error.message + '\n\nMake sure:\n1. Repository is public\n2. File path is correct\n3. File exists in main branch');
    } finally {
      setLoadingFromGitHub(false);
    }
  };

  const handleDeleteFile = async (file) => {
    if (!confirm(`Are you sure you want to delete "${file.file_name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase.from('code_files').delete().eq('id', file.id);
      if (error) throw error;

      alert('✅ File deleted successfully!');
      if (selectedFile?.id === file.id) {
        setSelectedFile(null);
        setCode('');
      }
      fetchFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Error deleting file: ' + error.message);
    }
  };

  const handleUploadFile = async () => {
    if (!uploadData.fileName || !uploadData.filePath) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const { error } = await supabase.from('code_files').insert([{
        file_name: uploadData.fileName,
        file_path: uploadData.filePath,
        file_content: '// New file - add your code here',
        file_type: uploadData.fileType,
      }]);

      if (error) throw error;

      alert('✅ File created successfully!');
      setShowUploadModal(false);
      setUploadData({ fileName: '', filePath: '', fileType: 'javascript' });
      fetchFiles();
    } catch (error) {
      console.error('Error creating file:', error);
      alert('Error creating file: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Code size={28} />
            Code Editor
          </h2>
          <p className="text-gray-600">Edit utility files with safety features</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium flex items-center gap-1">
            <AlertTriangle size={14} />
            Advanced Feature
          </span>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <AlertTriangle className="h-5 w-5 text-yellow-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Caution: Direct Code Editing</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Changes affect live production code</li>
                <li>Syntax errors will break the application</li>
                <li>Always test changes carefully</li>
                <li>Backups are created automatically</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-0">
        {/* File Explorer */}
        <div className={`${isFullscreen ? 'col-span-2' : 'col-span-3'} border-r border-gray-700`}>
          <FileExplorer
            files={files}
            selectedFile={selectedFile}
            onSelectFile={selectFile}
            onDeleteFile={handleDeleteFile}
            onCreateFile={(folderPath) => {
              setUploadData({
                ...uploadData,
                filePath: folderPath ? `${folderPath}/` : 'src/utils/',
              });
              setShowUploadModal(true);
            }}
          />
        </div>

        {/* Editor */}
        <div className={`${isFullscreen ? 'col-span-10' : 'col-span-9'}`}>
          {selectedFile ? (
            <div className={`bg-white shadow-sm border border-gray-200 ${isFullscreen ? 'h-screen rounded-none' : 'rounded-xl'}`}>
              {/* Editor Header */}
              <div className="border-b border-gray-200 p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedFile.file_name}</h3>
                  <p className="text-sm text-gray-600">{selectedFile.file_path}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 text-sm"
                    title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                  >
                    {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                  </button>
                  <button
                    onClick={loadFromGitHub}
                    disabled={loadingFromGitHub}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Code size={16} />
                    {loadingFromGitHub ? 'Loading...' : 'Load from GitHub'}
                  </button>
                  <button
                    onClick={fetchHistory}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 text-sm"
                  >
                    <History size={16} />
                    History
                  </button>
                  <button
                    onClick={handleReset}
                    disabled={!hasChanges}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RotateCcw size={16} />
                    Reset
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!hasChanges || saving}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save size={16} />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>

              {/* Validation Error */}
              {validationError && (
                <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Validation Error</p>
                    <p className="text-sm text-red-700 mt-1">{validationError}</p>
                  </div>
                </div>
              )}

              {/* Changes Indicator */}
              {hasChanges && !validationError && (
                <div className="mx-4 mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-600" />
                  <p className="text-sm text-blue-800">You have unsaved changes</p>
                </div>
              )}

              {/* Monaco Code Editor */}
              <div className="border-t border-gray-200">
                <Editor
                  height={isFullscreen ? 'calc(100vh - 180px)' : '600px'}
                  defaultLanguage="javascript"
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  onMount={(editor) => {
                    editorRef.current = editor;
                  }}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: true },
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: true,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    wordWrap: 'on',
                    formatOnPaste: true,
                    formatOnType: true,
                    suggestOnTriggerCharacters: true,
                    quickSuggestions: true,
                    folding: true,
                    bracketPairColorization: { enabled: true },
                  }}
                  loading={
                    <div className="flex items-center justify-center h-[600px] bg-gray-900">
                      <div className="text-white">Loading editor...</div>
                    </div>
                  }
                />
              </div>

              {/* Footer Info */}
              <div className="border-t border-gray-200 px-4 py-3 bg-gray-50 rounded-b-xl">
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <div className="flex items-center gap-4">
                    <span>Version: {selectedFile.version}</span>
                    {autoSaving && (
                      <span className="flex items-center gap-1 text-blue-600">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                        Auto-saving...
                      </span>
                    )}
                    {lastSaved && !autoSaving && (
                      <span className="text-green-600">
                        ✓ Saved {new Date(lastSaved).toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span>Last updated: {new Date(selectedFile.updated_at).toLocaleString()}</span>
                    {selectedFile.updated_by && <span>By: {selectedFile.updated_by}</span>}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Code className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Select a file to edit</p>
            </div>
          )}
        </div>
      </div>

      {/* Upload File Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Add New File</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  File Name *
                </label>
                <input
                  type="text"
                  value={uploadData.fileName}
                  onChange={(e) => setUploadData({ ...uploadData, fileName: e.target.value })}
                  placeholder="e.g., myGenerator.js"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  File Path *
                </label>
                <input
                  type="text"
                  value={uploadData.filePath}
                  onChange={(e) => setUploadData({ ...uploadData, filePath: e.target.value })}
                  placeholder="e.g., src/utils/myGenerator.js"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  File Type
                </label>
                <select
                  value={uploadData.fileType}
                  onChange={(e) => setUploadData({ ...uploadData, fileType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="json">JSON</option>
                  <option value="css">CSS</option>
                  <option value="html">HTML</option>
                </select>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUploadFile}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Create File
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Version History</h3>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {history.length === 0 ? (
                <p className="text-center text-gray-600 py-8">No history available</p>
              ) : (
                <div className="space-y-4">
                  {history.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-semibold text-gray-900">Version {item.version}</span>
                          <p className="text-sm text-gray-600">
                            {new Date(item.created_at).toLocaleString()}
                          </p>
                          {item.created_by && (
                            <p className="text-sm text-gray-600">By: {item.created_by}</p>
                          )}
                        </div>
                        <button
                          onClick={() => restoreVersion(item)}
                          className="px-3 py-1 text-sm border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50 transition"
                        >
                          Restore
                        </button>
                      </div>
                      {item.change_note && (
                        <p className="text-sm text-gray-700 mt-2">{item.change_note}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
