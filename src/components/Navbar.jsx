import React from 'react';

const Navbar = ({ onProfileClick, onHomeClick, currentView, className, onToggleSidebar }) => {
  return (
    <nav className={`fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-50 ${className}`}>
      <div className="px-4 flex items-center justify-between h-full">
        {/* Mobile menu button - only shows on mobile */}
        <button 
          className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          onClick={onToggleSidebar}
          aria-label="Toggle Menu"
        >
          <svg 
            className="w-5 h-5 text-gray-600 dark:text-gray-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 6h16M4 12h16m-7 6h7" 
            />
          </svg>
        </button>

        {/* Left side - Brand */}
        <button 
          onClick={onHomeClick}
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
          <span role="img" aria-label="plant" className="text-xl">🌱</span>
          <span className="font-semibold text-gray-800 dark:text-white">Digital Garden</span>
        </button>
        
        {/* Right side - Profile Link & Icon */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={onProfileClick}
            className={`text-gray-600 dark:text-gray-300 hover:text-gray-800 
                       dark:hover:text-white transition-colors ${
                         currentView === 'profile' ? 'font-semibold' : ''
                       }`}
          >
            Profile
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 