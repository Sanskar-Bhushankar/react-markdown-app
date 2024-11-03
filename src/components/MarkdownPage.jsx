// src/components/MarkdownPage.jsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css'; // Import KaTeX CSS for math rendering
import rehypeHighlight from 'rehype-highlight';

const MarkdownPage = ({ markdown }) => {
  return (
    <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-white">
      <ReactMarkdown
        children={markdown}
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeHighlight]}
        components={{
          code({ node, inline, className, children, ...props }) {
            return (
              <code
                className={`${className} bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white`}
                {...props}
              >
                {children}
              </code>
            );
          },
          pre({ node, children, ...props }) {
            return (
              <pre
                className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto"
                {...props}
              >
                {children}
              </pre>
            );
          },
        }}
      />
    </div>
  );
};

export default MarkdownPage;

