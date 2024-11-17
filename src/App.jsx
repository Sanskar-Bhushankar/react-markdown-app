import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Profile from './pages/Profile';
import MarkdownPage from './components/MarkdownPage';
import GraphView from './components/GraphView';

const MarkdownViewer = () => {
  const { '*': filePath } = useParams();
  const [markdownContent, setMarkdownContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      if (!filePath) return;
      setIsLoading(true);
      try {
        const response = await fetch(`/pages/${filePath}`);
        const content = await response.text();
        setMarkdownContent(content);
      } catch (error) {
        console.error('Error loading file:', error);
        setMarkdownContent('# Error loading file');
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [filePath]);

  if (isLoading) {
    return <div className="p-6 text-white">Loading...</div>;
  }

  const pathParts = filePath.split('/');
  const breadcrumb = (
    <div className="flex items-center text-lg font-medium mb-6">
      {pathParts.map((part, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <span className="mx-2 text-[#90EE90]">{'>'}</span>}
          <span className={index === pathParts.length - 1 ? 'text-[#90EE90]' : 'text-gray-300'}>
            {part.replace('.md', '')}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6">
      {breadcrumb}
      <MarkdownPage markdown={markdownContent} />
      <GraphView />
    </div>
  );
};

const App = () => {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <BrowserRouter>
      <div className="h-screen flex flex-col bg-[#1B1E2B]">
        <Navbar />
        <div className="flex flex-1 h-[calc(100vh-48px)] mt-12">
          <Sidebar />
          <main className="flex-1 relative bg-[#1B1E2B] text-gray-100">
            <div className="absolute inset-0 overflow-y-auto custom-scrollbar">
              <Routes>
                <Route path="/" element={<Profile />} />
                <Route path="/docs/*" element={<MarkdownViewer />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
