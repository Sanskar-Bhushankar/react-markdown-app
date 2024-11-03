import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MarkdownPage from './components/MarkdownPage';
import { ThemeProvider } from './context/ThemeContext';
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
    <ThemeProvider>
      <div className="flex min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
        <Sidebar onFileSelect={handleFileSelect} />
        <main className="flex-1 p-6 overflow-auto dark:bg-gray-900">
          <MarkdownPage markdown={markdownContent} />
        </main>
      </div>
    </ThemeProvider>
  );
};

export default App;
