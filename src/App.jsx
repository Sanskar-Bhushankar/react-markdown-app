import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MarkdownPage from './components/MarkdownPage';
import { ThemeProvider } from './context/ThemeContext';
import { fetchFileContent } from './utils/fileUtils';
import TableOfContents from './components/TableOfContents';

const App = () => {
  const [markdownContent, setMarkdownContent] = useState('# Select a file from the sidebar');
  const [currentFileName, setCurrentFileName] = useState('');

  const handleFileSelect = async (filePath) => {
    try {
      const content = await fetchFileContent(filePath);
      const fileName = filePath.split('/').pop().replace('.md', '');
      setCurrentFileName(fileName);
      setMarkdownContent(content);
    } catch (error) {
      setMarkdownContent('# Error loading file\n\nFailed to load the selected file.');
      setCurrentFileName('Error');
    }
  };

  return (
    <ThemeProvider>
      <div className="flex h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
        <Sidebar onFileSelect={handleFileSelect} />
        <main className="flex-1 p-6 overflow-hidden">
          <div className="container mx-auto h-full overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
            {currentFileName && (
              <div className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
                {currentFileName}
              </div>
            )}
            <MarkdownPage markdown={markdownContent} />
          </div>
        </main>
        <TableOfContents markdown={markdownContent} />
      </div>
    </ThemeProvider>
  );
};

export default App;
