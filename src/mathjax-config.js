// src/mathjax-config.js
export const MathJaxConfig = {
    tex: {
      inlineMath: [['$', '$'], ['\\(', '\\)']],
      displayMath: [['$$', '$$'], ['\\[', '\\]']],
    },
    options: {
      renderActions: {
        findScript: [0, () => {}, ''],
        replaceText: [100, (doc) => {
          // Customize the rendering behavior here if needed
        }, '']
      },
    },
  };
  