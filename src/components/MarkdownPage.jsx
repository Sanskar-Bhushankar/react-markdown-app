// // src/components/MarkdownPage.jsx
// import React from 'react';
// import ReactMarkdown from 'react-markdown';
// import gfm from 'remark-gfm';
// import rehypeHighlight from 'rehype-highlight';
// import rehypeReact from 'rehype-react';

// // Function to read Markdown content from a file (simplified)
// const MarkdownPage = ({ markdown }) => {
//   return (
//     <div className="prose">
//       <ReactMarkdown
//         remarkPlugins={[gfm]}
//         rehypePlugins={[rehypeHighlight]}
//       >
//         {markdown}
//       </ReactMarkdown>
//     </div>
//   );
// };

// export default MarkdownPage;


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
    <div className="prose">
      <ReactMarkdown
        children={markdown}
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeHighlight]}
      />
    </div>
  );
};

export default MarkdownPage;

