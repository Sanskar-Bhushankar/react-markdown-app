// src/components/MarkdownPage.jsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MarkdownPage = ({ markdown }) => {
  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="prose dark:prose-invert prose-slate max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
        components={{
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

          table({ node, ...props }) {
            return (
              <div className="overflow-x-auto max-w-full scrollbar-hide">
                <table {...props} />
              </div>
            );
          },

          iframe({ node, ...props }) {
            return (
              <div className="video-container my-4">
                <iframe
                  {...props}
                  className="w-full aspect-video rounded-lg"
                  style={{ maxWidth: '600px', margin: '0 auto' }}
                />
              </div>
            );
          }
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownPage;

