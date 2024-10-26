// src/markdownProcessor.js
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeStringify from 'rehype-stringify';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';

export const processMarkdown = async (markdown) => {
  const result = await unified()
    .use(remarkParse)        // Parse Markdown
    .use(remarkGfm)         // GitHub Flavored Markdown
    .use(remarkMath)        // Math support
    .use(rehypeKatex)       // KaTeX support
    .use(rehypeHighlight)    // Syntax highlighting
    .use(rehypeStringify)   // Convert to HTML
    .process(markdown);     // Process the markdown

  return String(result);    // Return processed HTML as a string
};
