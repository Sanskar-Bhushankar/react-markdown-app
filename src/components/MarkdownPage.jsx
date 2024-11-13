// src/components/MarkdownPage.jsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkToc from 'remark-toc';
import rehypePrism from 'rehype-prism';
import rehypeRaw from 'rehype-raw';

const MarkdownPage = ({ markdown }) => {
  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
  };

  const processMarkdown = (content) => {
    let processedContent = content.replace(
      /!\[\[(.*?)(?:\s*\|\s*(\d+))?\]\]/g,
      (match, filename, size) => {
        const encodedPath = encodeURIComponent(filename.trim());
        return `![${filename}](/pages/images/${encodedPath}){width=${size}}`;
      }
    );

    processedContent = processedContent.replace(
      /==(.*?)==/g,
      '<mark>$1</mark>'
    );

    return processedContent;
  };

  return (
    <div className="prose dark:prose-invert prose-slate max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath, remarkToc]}
        rehypePlugins={[rehypeKatex, rehypePrism, rehypeRaw]}
        components={{
          // Blockquote styling for notes
          blockquote: ({ node, ...props }) => (
            <div className="flex gap-2 p-4 bg-blue-50 dark:bg-yellow-900/30 rounded-lg border-l-4 border-blue-500 dark:border-yellow-500">
              <svg 
                className="w-6 h-6 text-blue-500 dark:text-yellow-500 flex-shrink-0" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <div {...props} className="mt-0" />
            </div>
          ),

          // Updated code block with horizontal scroll
          code({ node, inline, className, children, ...props }) {
            if (!inline && className?.includes('language-')) {
              return (
                <div className="relative group">
                  <button
                    onClick={() => copyToClipboard(String(children))}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 
                             transition-opacity duration-200 px-2 py-1 text-xs
                             bg-gray-700 dark:bg-gray-600 text-white rounded z-10"
                  >
                    Copy
                  </button>
                  <div className="overflow-x-auto max-w-full scrollbar-hide">
                    <SyntaxHighlighter
                      language={className.replace('language-', '')}
                      style={vscDarkPlus}
                      customStyle={{
                        margin: 0,
                        borderRadius: '0.5rem',
                      }}
                      showLineNumbers={false}
                      wrapLongLines={false}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  </div>
                </div>
              );
            }
            return <code className={className} {...props}>{children}</code>;
          },

          // Updated image component to hide width attribute
          img: ({ src, alt, width, ...props }) => {
            if (src.startsWith('/pages/images/')) {
              return (
                <img
                  src={src}
                  alt={alt}
                  className="rounded-lg shadow-md h-auto"
                  width={width}
                  style={{ maxWidth: '100%' }}
                  {...props}
                />
              );
            }
            return <img src={src} alt={alt} {...props} />;
          },

          // Handle highlighted text
          mark: ({ children }) => (
            <span className="bg-yellow-100 dark:bg-yellow-900/50 px-1 rounded">
              {children}
            </span>
          ),

          // Add custom component for ==text== syntax
          text: ({ children }) => {
            if (typeof children !== 'string') return children;
            
            return children.split(/(?<===)(.+?)(?===)/).map((text, i) => {
              if (i % 2 === 1) {
                return (
                  <span key={i} className="bg-yellow-100 dark:bg-yellow-900/50 px-1 rounded">
                    {text}
                  </span>
                );
              }
              return text;
            });
          },

          // Added table component with horizontal scroll
          table({ node, ...props }) {
            return (
              <div className="overflow-x-auto max-w-full scrollbar-hide">
                <table {...props} />
              </div>
            );
          },

          // Add this new component configuration
          iframe: ({ node, ...props }) => {
            return (
              <div className="video-wrapper my-4">
                <iframe
                  {...props}
                  className="w-full h-[200px] md:h-[315px] rounded-lg"
                  title={props.title || 'Embedded content'}
                />
              </div>
            );
          },
        }}
      >
        {processMarkdown(markdown)}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownPage;

