import React, { useEffect, useState } from 'react';
import { fetchFilesList } from '../utils/fileUtils';

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

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  return (
    <div className="sidebar w-64 bg-gray-100 p-4 h-screen overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Files</h2>
      <ul className="space-y-1">
        {files.map((item) => (
          <FileItem key={item.path} item={item} onFileSelect={onFileSelect} />
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;

