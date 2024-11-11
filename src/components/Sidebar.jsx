import React, { useEffect, useState } from 'react';
import { fetchFilesList } from '../utils/fileUtils';
import { useTheme } from '../context/ThemeContext';
import SearchOverlay from './SearchOverlay';

const FileItem = ({ item, onFileSelect, depth = 0, selectedFile }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isSelected = selectedFile === item.path;

  const handleClick = () => {
    if (item.isDirectory) {
      setIsExpanded(!isExpanded);
    } else {
      onFileSelect(item.path);
    }
  };

  return (
    <li>
      <div
        className={`cursor-pointer p-2 rounded flex items-center space-x-2 transition-colors duration-200
          ${isSelected ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
        style={{ paddingLeft: `${depth * 1.5}rem` }}
        onClick={handleClick}
      >
        <span>{item.isDirectory ? (isExpanded ? '📂' : '📁') : '📄'}</span>
        <span className="truncate">{item.name}</span>
      </div>
      {item.isDirectory && isExpanded && (
        <ul className="ml-4">
          {item.children.map((child) => (
            <FileItem
              key={child.path}
              item={child}
              onFileSelect={onFileSelect}
              depth={depth + 1}
              selectedFile={selectedFile}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

const Sidebar = ({ onFileSelect }) => {
  const [files, setFiles] = useState([]);
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  const handleFileSelect = (filePath) => {
    setSelectedFile(filePath);
    onFileSelect(filePath);
  };

  const refreshFiles = async () => {
    try {
      const data = await fetchFilesList();
      setFiles(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    refreshFiles();
    const interval = setInterval(refreshFiles, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-expand parent folders of selected file
  useEffect(() => {
    if (selectedFile) {
      const pathParts = selectedFile.split('/');
      // Remove the file name to get parent folders
      pathParts.pop();
      // TODO: Implement folder expansion logic if needed
    }
  }, [selectedFile]);

  const toggleFolder = (path) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  // Recursive rendering function
  const renderItems = (items, level = 0) => {
    return (
      <ul className={`pl-${level * 4} space-y-1`}>
        {items.map((item) => (
          <li key={item.path} className="relative">
            {item.isDirectory ? (
              <div className="flex flex-col">
                <button
                  onClick={() => toggleFolder(item.path)}
                  className="flex items-center py-1 px-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                >
                  <span className="mr-2">
                    {expandedFolders.has(item.path) ? '📂' : '📁'}
                  </span>
                  <span className="truncate">{item.name}</span>
                </button>
                {expandedFolders.has(item.path) && item.children && (
                  <div className="ml-4">
                    {renderItems(item.children, level + 1)}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onFileSelect(item.path)}
                className="flex items-center py-1 px-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              >
                <span className="mr-2">📄</span>
                <span className="truncate">
                  {item.name.replace('.md', '')}
                </span>
              </button>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <aside className="w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 h-full overflow-y-auto sidebar-scroll">
      <div className="sticky top-0 p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-10">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Files</h2>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white"
          >
            {isDarkMode ? '🌞' : '🌙'}
          </button>
        </div>
      </div>
      <nav className="p-4 pb-20">
        {renderItems(files)}
      </nav>
    </aside>
  );
};

export default Sidebar;

