// src/components/MarkdownPage.jsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css'; // Import KaTeX CSS for math rendering
import rehypeHighlight from 'rehype-highlight';

const MarkdownPage = ({ markdown }) => {
  // Function to process markdown content and convert image syntax
  const processMarkdown = (content) => {
    return content.replace(/!\[\[(.*?)\]\]/g, (match, imageName) => {
      // Encode the image name to handle spaces and special characters
      const encodedName = encodeURIComponent(imageName.trim());
      return `![${imageName}](/pages/images/${encodedName})`;
    });
  };

  return (
    <div className="prose dark:prose-invert max-w-none">
      <ReactMarkdown
        children={processMarkdown(markdown)}
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeHighlight]}
        components={{
          // Table components for horizontal scrolling
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto w-full border rounded-lg">
              <table className="min-w-full" {...props} />
            </div>
          ),
          // Image handling
          p: ({node, children, ...props}) => {
            if (node.children[0]?.tagName === 'img') {
              return <div className="image-container">{children}</div>;
            }
            return <p {...props}>{children}</p>;
          },
          img: ({ node, alt, src, ...props }) => {
            // Decode the URL to get the original filename
            const decodedSrc = decodeURIComponent(src);
            return (
              <img
                alt={alt}
                src={decodedSrc}
                className="max-w-full h-auto rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                onError={(e) => {
                  console.error(`Failed to load image: ${decodedSrc}`);
                  e.target.style.display = 'none'; // Hide broken images
                }}
                {...props}
              />
            );
          },
          code({ node, inline, className, children, ...props }) {
            return (
              <code
                className={`${className} bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200`}
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

