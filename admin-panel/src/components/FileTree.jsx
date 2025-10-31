import { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from 'lucide-react';

export default function FileTree({ files, selectedFile, onSelectFile }) {
  const [expandedFolders, setExpandedFolders] = useState(new Set(['root']));

  // Build folder tree structure
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

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const colors = {
      'js': 'text-yellow-500',
      'jsx': 'text-blue-500',
      'ts': 'text-blue-600',
      'tsx': 'text-blue-600',
      'css': 'text-pink-500',
      'html': 'text-orange-500',
      'json': 'text-green-500',
      'md': 'text-gray-600',
    };
    return colors[ext] || 'text-gray-500';
  };

  const renderTree = (node, path = '', level = 0) => {
    const items = [];

    // Render folders first
    Object.keys(node)
      .filter(key => key !== '_files')
      .sort()
      .forEach(folderName => {
        const folderPath = path ? `${path}/${folderName}` : folderName;
        const isExpanded = expandedFolders.has(folderPath);

        items.push(
          <div key={folderPath}>
            <button
              onClick={() => toggleFolder(folderPath)}
              className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100 rounded text-sm group"
              style={{ paddingLeft: `${level * 12 + 8}px` }}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
              )}
              {isExpanded ? (
                <FolderOpen className="w-4 h-4 text-blue-500 flex-shrink-0" />
              ) : (
                <Folder className="w-4 h-4 text-blue-500 flex-shrink-0" />
              )}
              <span className="text-gray-700 font-medium truncate">{folderName}</span>
            </button>

            {isExpanded && (
              <div>
                {renderTree(node[folderName], folderPath, level + 1)}
              </div>
            )}
          </div>
        );
      });

    // Render files
    if (node._files) {
      node._files
        .sort((a, b) => a.file_name.localeCompare(b.file_name))
        .forEach(file => {
          const isSelected = selectedFile?.id === file.id;
          
          items.push(
            <button
              key={file.id}
              onClick={() => onSelectFile(file)}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition ${
                isSelected
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
              style={{ paddingLeft: `${level * 12 + 32}px` }}
            >
              <File className={`w-4 h-4 flex-shrink-0 ${getFileIcon(file.file_name)}`} />
              <span className="truncate">{file.file_name}</span>
            </button>
          );
        });
    }

    return items;
  };

  const tree = buildTree();

  return (
    <div className="py-2">
      {renderTree(tree)}
    </div>
  );
}
