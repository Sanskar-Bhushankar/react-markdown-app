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

  return (
    <>
      <div className="sidebar w-64 bg-gray-100 dark:bg-gray-800 p-4 h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Files</h2>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white"
          >
            {isDarkMode ? '🌞' : '🌙'}
          </button>
        </div>

        {/* Search Button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full px-3 py-2 mb-4 rounded-lg border border-gray-200 dark:border-gray-600 
                   bg-white dark:bg-gray-700 
                   text-gray-500 dark:text-gray-400
                   hover:bg-gray-50 dark:hover:bg-gray-600
                   text-left"
        >
          Search files...
        </button>

        {error ? (
          <div className="text-red-500 p-4">Error: {error}</div>
        ) : (
          <ul className="space-y-1">
            {files.map((item) => (
              <FileItem 
                key={item.path} 
                item={item} 
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
                className="text-gray-800 dark:text-white"
              />
            ))}
          </ul>
        )}
      </div>

      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        files={files}
        onFileSelect={handleFileSelect}
      />
    </>
  );
};

export default Sidebar;

