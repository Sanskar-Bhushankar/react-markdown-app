import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { sidebarTree } from '../data/sidebarTree.js';

// Chevron icon component
const ChevronIcon = ({ isOpen }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-90' : ''}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

const FileItem = ({ item, depth = 0 }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const currentPath = decodeURIComponent(location.pathname.replace('/docs/', ''));
  const isActive = currentPath === item.path;
  const isParentOfActive = item.type === 'directory' && currentPath.startsWith(item.path + '/');

  useEffect(() => {
    if (isParentOfActive) {
      setIsOpen(true);
    }
  }, [isParentOfActive]);

  if (item.type === 'directory') {
    return (
      <div className="flex flex-col">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center px-4 py-2 w-full text-left hover:bg-gray-800 group text-[15px] text-gray-300 hover:text-white"
        >
          <span className="mr-2">
            {isOpen ? '📂' : '📁'}
          </span>
          <span className="font-medium">{item.name}</span>
          <span className="ml-auto text-gray-500 group-hover:text-gray-300">
            <ChevronIcon isOpen={isOpen} />
          </span>
        </button>
        {isOpen && (
          <div>
            {item.children?.map((child, index) => (
              <div key={index} className={`${isActive ? 'bg-[#044A26]' : ''}`}>
                <FileItem item={child} depth={depth + 1} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      to={`/docs/${item.path}`}
      className={`flex items-center px-4 py-2 hover:bg-gray-800 text-[15px] ml-4
        ${isActive ? 'bg-[#044A26]' : ''} 
        text-gray-300 hover:text-white`}
    >
      <span className="mr-2">📄</span>
      <span>{item.name.replace('.md', '')}</span>
    </Link>
  );
};

const Sidebar = () => {
  return (
    <div className="w-64 bg-[#1B1E2B] border-r border-gray-700 overflow-y-auto custom-scrollbar">
      <div className="p-4">
        <h2 className="text-xl font-semibold text-white mb-4">Files</h2>
        <div className="space-y-0.5">
          {sidebarTree.map((item, index) => (
            <FileItem key={index} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

