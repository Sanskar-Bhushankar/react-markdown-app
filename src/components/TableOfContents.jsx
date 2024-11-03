import React, { useEffect, useState } from 'react';

const TableOfContents = ({ markdown }) => {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const extractHeadings = (content) => {
      const headingRegex = /^(#{1,6})\s+(.+)$/gm;
      const matches = [...content.matchAll(headingRegex)];
      
      return matches.map((match, index) => ({
        id: `heading-${index}`,
        level: match[1].length,
        text: match[2],
      }));
    };

    setHeadings(extractHeadings(markdown));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.textContent);
          }
        });
      },
      { rootMargin: '-20% 0% -35% 0%' }
    );

    document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading) => {
      observer.observe(heading);
    });

    return () => observer.disconnect();
  }, [markdown]);

  const scrollToHeading = (headingText) => {
    const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const targetElement = Array.from(elements).find(
      el => el.textContent === headingText
    );

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="w-64 h-full border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex flex-col">
      <div className="sticky top-0 bg-white dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Table of Contents
        </h3>
      </div>
      
      <nav className="flex-1 overflow-y-auto overflow-x-hidden p-2">
        {headings.map((heading) => (
          <button
            key={heading.id}
            onClick={() => scrollToHeading(heading.text)}
            className={`
              w-full text-left px-3 py-2 rounded-md
              transition-colors duration-200 ease-in-out
              text-sm truncate
              ${activeId === heading.text 
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }
              ${heading.level === 1 ? 'font-medium' : ''}
              ${heading.level === 2 ? 'ml-2' : ''}
              ${heading.level === 3 ? 'ml-4' : ''}
              ${heading.level === 4 ? 'ml-6' : ''}
              ${heading.level === 5 ? 'ml-8' : ''}
              ${heading.level === 6 ? 'ml-10' : ''}
            `}
          >
            {heading.text}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TableOfContents; 