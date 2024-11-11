import React, { useState } from 'react';
import { sidebarTree } from '../data/sidebarTree.js';

const Sidebar = ({ onFileSelect, currentFile }) => {
  const [expandedFolders, setExpandedFolders] = useState({});

  const toggleFolder = (path) => {
    setExpandedFolders(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const renderTree = (items) => {
    return items.map((item) => {
      if (item.type === 'directory') {
        return (
          <div key={item.path}>
            <div
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-1 rounded"
              onClick={() => toggleFolder(item.path)}
            >
              <span>{expandedFolders[item.path] ? '📂' : '📁'}</span>
              <span className="text-sm">{item.name}</span>
            </div>
            <div className={`ml-4 ${expandedFolders[item.path] ? 'block' : 'hidden'}`}>
              {renderTree(item.children)}
            </div>
          </div>
        );
      }
      
      const isCurrentFile = currentFile === item.path;
      
      return (
        <div
          key={item.path}
          className={`flex items-center gap-2 cursor-pointer p-1 rounded ml-4
            ${isCurrentFile 
              ? 'bg-green-100 dark:bg-green-900' 
              : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          onClick={() => onFileSelect(item.path)}
        >
          <span>📄</span>
          <span className="text-sm">{item.name.replace('.md', '')}</span>
        </div>
      );
    });
  };

  return (
    <aside className="w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 h-full overflow-y-auto overflow-x-hidden custom-scrollbar">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Files</h2>
        {renderTree(sidebarTree)}
      </div>
    </aside>
  );
};

export default Sidebar;

