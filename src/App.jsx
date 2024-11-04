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

  const handleFileSelect = async (filePath) => {
    try {
      const content = await fetchFileContent(filePath);
      const fileName = filePath.split('/').pop().replace('.md', '');
      setCurrentFileName(fileName);
      setMarkdownContent(content);
      setCurrentView('main');
    } catch (error) {
      setMarkdownContent('# Error loading file\n\nFailed to load the selected file.');
      setCurrentFileName('Error');
    }
  };

  return (
    <ThemeProvider>
      <div className="h-screen flex flex-col overflow-hidden bg-white dark:bg-gray-900">
        <Navbar 
          onProfileClick={() => setCurrentView('profile')} 
          onHomeClick={() => setCurrentView('main')}
          currentView={currentView}
        />
        <div className="flex flex-1 overflow-hidden pt-12">
          <Sidebar onFileSelect={handleFileSelect} />
          <main className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-gray-900">
            <div className="flex-1 overflow-auto scrollbar-hide">
              <div className="p-6">
                {currentView === 'profile' ? (
                  <Profile />
                ) : (
                  <>
                    {currentFileName && (
                      <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
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
