// import React, { useEffect, useState } from 'react';
// import Header from './components/Header';
// import Footer from './components/Footer';
// import Sidebar from './components/Sidebar';
// import MainContent from './components/MainContent';
// import MarkdownPage from './components/MarkdownPage';

// const App = () => {
//   const [markdownContent, setMarkdownContent] = useState('');

//   const loadMarkdown = async (file) => {
//     const response = await fetch(`/pages/${file}`);
//     const text = await response.text();
//     setMarkdownContent(text);
//   };

//   useEffect(() => {
//     // Load the home markdown file by default
//     loadMarkdown('home.md');
//   }, []);

//   return (
//     <div className="flex flex-col h-screen">
//       <Header />
//       <div className="flex flex-1">
//         <Sidebar loadMarkdown={loadMarkdown} />
//         <MainContent>
//           <MarkdownPage markdown={markdownContent} />
//         </MainContent>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default App;



// src/App.jsx
import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import MarkdownPage from './components/MarkdownPage';

const App = () => {
  const [markdownContent, setMarkdownContent] = useState('');

  const loadMarkdown = async (file) => {
    const response = await fetch(`/pages/${file}`);
    if (response.ok) {
      const text = await response.text();
      setMarkdownContent(text);
    } else {
      console.error('Error loading markdown file:', response.status);
    }
  };

  useEffect(() => {
    // Load the home markdown file by default
    loadMarkdown('home.md');
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar loadMarkdown={loadMarkdown} />
        <MainContent>
          <MarkdownPage markdown={markdownContent} />
        </MainContent>
      </div>
      <Footer />
    </div>
  );
};

export default App;
