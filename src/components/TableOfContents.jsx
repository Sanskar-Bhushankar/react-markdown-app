import React, { useEffect, useState } from 'react';

const TableOfContents = ({ markdown }) => {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const processText = (text) => {
      return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    };

    const extractHeadings = (markdown) => {
      const headings = [];
      const lines = markdown.split('\n');
      
      lines.forEach(line => {
        const match = line.match(/^(#{1,6})\s+(.+)/);
        if (match) {
          const level = match[1].length;
          let text = match[2];
          
          text = text.replace(/<strong>(.*?)<\/strong>/g, '$1');
          text = text.replace(/\*\*(.*?)\*\*/g, '$1');
          
          headings.push({
            level,
            text,
            id: text.toLowerCase()
              .replace(/<[^>]+>/g, '')
              .replace(/[^\w\s-]/g, '')
              .replace(/\s+/g, '-')
          });
        }
      });
      
      return headings;
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
    <div className="w-64 flex flex-col overflow-hidden border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="flex-none px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Table of Contents
        </h3>
      </div>
      
      <nav className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
        <div className="p-2 space-y-0.5">
          {headings.map((heading) => (
            <button
              key={heading.id}
              onClick={() => scrollToHeading(heading.text)}
              className={`
                w-full text-left px-3 py-1.5 rounded-md
                transition-all duration-200 ease-in-out
                text-sm break-words whitespace-normal
                ${activeId === heading.text 
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }
                ${heading.level === 1 ? 'font-medium text-[14px]' : ''}
                ${heading.level === 2 ? 'ml-2 text-[13px]' : ''}
                ${heading.level === 3 ? 'ml-3 text-[12px]' : ''}
                ${heading.level === 4 ? 'ml-4 text-[12px]' : ''}
                ${heading.level === 5 ? 'ml-5 text-[11px]' : ''}
                ${heading.level === 6 ? 'ml-6 text-[11px]' : ''}
              `}
            >
              <div className="flex items-start gap-2 min-w-0">
                <span className={`
                  w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 transition-colors
                  ${activeId === heading.text 
                    ? 'bg-blue-500 dark:bg-blue-400' 
                    : 'bg-gray-300 dark:bg-gray-600 group-hover:bg-blue-400 dark:group-hover:bg-blue-500'
                  }
                `}></span>
                <span className="break-words">{heading.text}</span>
              </div>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default TableOfContents;