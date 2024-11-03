import React, { useEffect, useState } from 'react';
import { fetchFilesList } from '../utils/fileUtils';
import { useTheme } from '../context/ThemeContext';

const FileItem = ({ item, onFileSelect, depth = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

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
        className="cursor-pointer hover:bg-gray-200 p-2 rounded flex items-center space-x-2"
        style={{ paddingLeft: `${depth * 1.5}rem` }}
        onClick={handleClick}
      >
        <span>{item.isDirectory ? (isExpanded ? '📂' : '📁') : '📄'}</span>
        <span>{item.name}</span>
      </div>
      {item.isDirectory && isExpanded && (
        <ul className="ml-4">
          {item.children.map((child) => (
            <FileItem
              key={child.path}
              item={child}
              onFileSelect={onFileSelect}
              depth={depth + 1}
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
  const { isDarkMode, toggleTheme } = useTheme();

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

  return (
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
      {error ? (
        <div className="text-red-500 p-4">Error: {error}</div>
      ) : (
        <ul className="space-y-1">
          {files.map((item) => (
            <FileItem 
              key={item.path} 
              item={item} 
              onFileSelect={onFileSelect}
              className="text-gray-800 dark:text-white"
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default Sidebar;

