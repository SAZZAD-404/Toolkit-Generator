import { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder, FolderOpen, Plus, Trash2 } from 'lucide-react';

export default function FileExplorer({ files, selectedFile, onSelectFile, onDeleteFile, onCreateFile }) {
  const [expandedFolders, setExpandedFolders] = useState(new Set(['src', 'src/utils', 'src/components']));
  const [contextMenu, setContextMenu] = useState(null);

  // Build folder tree from flat file list
  const buildTree = () => {
    const tree = {};
    
    files.forEach(file => {
      const parts = file.file_path.split('/');
      let current = tree;
      
      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          // It's a file
          if (!current._files) current._files = [];
          current._files.push(file);
        } else {
          // It's a folder
          if (!current[part]) {
            current[part] = {};
          }
          current = current[part];
        }
      });
    });
    
    return tree;
  };

  const toggleFolder = (path) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const handleContextMenu = (e, item, type) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      item,
      type,
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const renderTree = (node, path = '', level = 0) => {
    const entries = Object.entries(node).filter(([key]) => key !== '_files');
    const files = node._files || [];

    return (
      <div>
        {/* Render folders */}
        {entries.map(([folderName, children]) => {
          const folderPath = path ? `${path}/${folderName}` : folderName;
          const isExpanded = expandedFolders.has(folderPath);

          return (
            <div key={folderPath}>
              <div
                className="flex items-center gap-1 px-2 py-1 hover:bg-gray-700 cursor-pointer group"
                style={{ paddingLeft: `${level * 12 + 8}px` }}
                onClick={() => toggleFolder(folderPath)}
                onContextMenu={(e) => handleContextMenu(e, folderPath, 'folder')}
              >
                {isExpanded ? (
                  <ChevronDown size={14} className="text-gray-400" />
                ) : (
                  <ChevronRight size={14} className="text-gray-400" />
                )}
                {isExpanded ? (
                  <FolderOpen size={16} className="text-blue-400" />
                ) : (
                  <Folder size={16} className="text-blue-400" />
                )}
                <span className="text-sm text-gray-200">{folderName}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCreateFile(folderPath);
                  }}
                  className="ml-auto opacity-0 group-hover:opacity-100 p-0.5 hover:bg-gray-600 rounded"
                  title="New file"
                >
                  <Plus size={12} className="text-gray-400" />
                </button>
              </div>
              {isExpanded && renderTree(children, folderPath, level + 1)}
            </div>
          );
        })}

        {/* Render files */}
        {files.map((file) => (
          <div
            key={file.id}
            className={`flex items-center gap-2 px-2 py-1 cursor-pointer group ${
              selectedFile?.id === file.id
                ? 'bg-indigo-600 text-white'
                : 'hover:bg-gray-700 text-gray-200'
            }`}
            style={{ paddingLeft: `${level * 12 + 24}px` }}
            onClick={() => onSelectFile(file)}
            onContextMenu={(e) => handleContextMenu(e, file, 'file')}
          >
            <File size={16} className={selectedFile?.id === file.id ? 'text-white' : 'text-gray-400'} />
            <span className="text-sm flex-1 truncate">{file.file_name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteFile(file);
              }}
              className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-gray-600 rounded"
              title="Delete"
            >
              <Trash2 size={12} className="text-red-400" />
            </button>
          </div>
        ))}
      </div>
    );
  };

  const tree = buildTree();

  return (
    <div className="h-full bg-gray-800 text-white overflow-y-auto" onClick={closeContextMenu}>
      <div className="p-3 border-b border-gray-700 flex items-center justify-between">
        <span className="text-sm font-semibold uppercase text-gray-400">Explorer</span>
        <button
          onClick={() => onCreateFile('')}
          className="p-1 hover:bg-gray-700 rounded"
          title="New file"
        >
          <Plus size={16} className="text-gray-400" />
        </button>
      </div>
      <div className="py-2">
        {renderTree(tree)}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed bg-gray-800 border border-gray-600 rounded shadow-lg py-1 z-50"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={closeContextMenu}
        >
          {contextMenu.type === 'folder' && (
            <button
              onClick={() => onCreateFile(contextMenu.item)}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-2"
            >
              <Plus size={14} />
              New File
            </button>
          )}
          {contextMenu.type === 'file' && (
            <button
              onClick={() => onDeleteFile(contextMenu.item)}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-700 text-red-400 flex items-center gap-2"
            >
              <Trash2 size={14} />
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
