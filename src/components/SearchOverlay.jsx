import React, { useState, useEffect } from 'react';
import { fetchFileContent } from '../utils/fileUtils';
import MarkdownPage from './MarkdownPage';

const SearchOverlay = ({ isOpen, onClose, files, onFileSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [selectedPreview, setSelectedPreview] = useState(null);
  const [previewContent, setPreviewContent] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setFilteredFiles([]);
      setSelectedPreview(null);
      setPreviewContent('');
    }
  }, [isOpen]);

  const filterFiles = (items, query) => {
    let results = [];
    items.forEach(item => {
      if (item.name.toLowerCase().includes(query.toLowerCase())) {
        results.push(item);
      }
      if (item.children) {
        const childResults = filterFiles(item.children, query);
        results = [...results, ...childResults];
      }
    });
    return results;
  };

  useEffect(() => {
    if (searchQuery) {
      const results = filterFiles(files, searchQuery);
      setFilteredFiles(results);
    } else {
      setFilteredFiles([]);
    }
  }, [searchQuery, files]);

  const handleFileClick = async (file) => {
    // If file is already selected and previewed, open it
    if (selectedPreview?.path === file.path) {
      onFileSelect(file.path);
      onClose();
      return;
    }

    // Otherwise, load the preview
    try {
      const content = await fetchFileContent(file.path);
      setPreviewContent(content);
      setSelectedPreview(file);
    } catch (error) {
      console.error('Error loading preview:', error);
    }
  };

  const handleOpenFile = (file) => {
    onFileSelect(file.path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="w-[90%] h-[90%] bg-white dark:bg-gray-900 rounded-lg shadow-xl flex flex-col">
        {/* Search Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 
                       bg-white dark:bg-gray-800 
                       text-gray-900 dark:text-white
                       placeholder-gray-500 dark:placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              onClick={onClose}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Results Area */}
        {searchQuery && (
          <div className="flex-1 flex overflow-hidden">
            {/* Results Sidebar */}
            <div className="w-64 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
              <div className="p-2">
                {filteredFiles.map((file) => (
                  <button
                    key={file.path}
                    onClick={() => handleFileClick(file)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm mb-1
                             hover:bg-gray-100 dark:hover:bg-gray-800
                             ${selectedPreview?.path === file.path 
                               ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                               : 'text-gray-600 dark:text-gray-300'
                             }`}
                  >
                    {file.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1 overflow-y-auto">
              {selectedPreview ? (
                <div 
                  onClick={() => handleOpenFile(selectedPreview)}
                  className="cursor-pointer"
                >
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {selectedPreview.name}
                    </h2>
                  </div>
                  <div className="p-4">
                    <div className="prose dark:prose-invert prose-slate max-w-none">
                      <MarkdownPage markdown={previewContent} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
                  Select a file to preview
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchOverlay;