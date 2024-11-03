import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MarkdownPage from './components/MarkdownPage';
import { fetchFileContent } from './utils/fileUtils';

const App = () => {
  const [markdownContent, setMarkdownContent] = useState('# Select a file from the sidebar');

  const handleFileSelect = async (filePath) => {
    try {
      const content = await fetchFileContent(filePath);
      setMarkdownContent(content);
    } catch (error) {
      setMarkdownContent('# Error loading file\n\nFailed to load the selected file.');
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar onFileSelect={handleFileSelect} />
      <main className="flex-1 p-6 overflow-auto">
        <MarkdownPage markdown={markdownContent} />
      </main>
    </div>
  );
};

export default App;
