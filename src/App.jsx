import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MarkdownPage from './components/MarkdownPage';
import { ThemeProvider } from './context/ThemeContext';
import { fetchFileContent } from './utils/fileUtils';
import TableOfContents from './components/TableOfContents';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';

const App = () => {
  const [markdownContent, setMarkdownContent] = useState('');
  const [currentFileName, setCurrentFileName] = useState('');
  const [currentView, setCurrentView] = useState('profile');
  const [currentFile, setCurrentFile] = useState(null);

  const handleFileSelect = async (filePath) => {
    try {
      const content = await fetchFileContent(filePath);
      const pathParts = filePath.split(/[/\\]/);
      const fileName = pathParts.pop().replace('.md', '');
      
      const formattedPath = pathParts
        .filter(part => part !== 'pages' && part !== '')
        .concat(fileName)
        .join(' > ');
      
      setCurrentFileName(formattedPath);
      setMarkdownContent(content);
      setCurrentView('main');
      setCurrentFile(filePath);
    } catch (error) {
      setMarkdownContent('# Error loading file\n\nFailed to load the selected file.');
      setCurrentFileName('Error');
    }
  };

  return (
    <ThemeProvider>
      <div className="h-screen flex flex-col bg-white dark:bg-gray-900 overflow-hidden">
        <Navbar 
          onProfileClick={() => setCurrentView('profile')} 
          onHomeClick={() => setCurrentView('main')}
          currentView={currentView}
          className="flex-shrink-0 h-12"
        />
        <div className="flex flex-1 h-[calc(100vh-48px)] mt-12">
          <Sidebar 
            onFileSelect={handleFileSelect} 
            currentFile={currentFile} 
          />
          <main className="flex-1 relative bg-white dark:bg-gray-900">
            <div className="absolute inset-0 overflow-y-auto hide-scrollbar">
              <div className="p-6 max-w-full">
                {currentView === 'profile' ? (
                  <Profile />
                ) : (
                  <>
                    {currentFileName && (
                      <h1 className="mb-4 text-2xl font-bold text-[#90EE90]">
                        {currentFileName}
                      </h1>
                    )}
                    <div className="prose dark:prose-invert prose-slate max-w-none">
                      <MarkdownPage markdown={markdownContent} />
                    </div>
                  </>
                )}
              </div>
            </div>
          </main>
          {currentView !== 'profile' && <TableOfContents markdown={markdownContent} />}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;
