import React from 'react';

const Breadcrumb = ({ filePath }) => {
  if (!filePath) return null;

  const parts = filePath.split('/');
  const breadcrumbs = parts.map((part, index) => {
    const isLast = index === parts.length - 1;

    return (
      <div key={index} className="flex items-center">
        {index > 0 && (
          <span className="mx-2 text-[#90EE90]">{'>'}</span>
        )}
        <span 
          className={`${
            isLast ? 'text-[#90EE90]' : 'text-gray-300'
          } hover:text-white transition-colors`}
        >
          {part.replace('.md', '')}
        </span>
      </div>
    );
  });

  return (
    <div className="flex items-center text-lg font-medium mb-6">
      {breadcrumbs}
    </div>
  );
};

export default Breadcrumb; 