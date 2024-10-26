// import React from 'react';

// const Sidebar = ({ loadMarkdown }) => {
//   return (
//     <aside className="bg-gray-200 p-4">
//       <h2 className="font-bold mb-2">Navigation</h2>
//       <ul>
//         <li className="mb-1">
//           <button 
//             onClick={() => loadMarkdown('home.md')}
//             className="text-blue-600"
//           >
//             Home
//           </button>
//         </li>
//         <li className="mb-1">
//           <button 
//             onClick={() => loadMarkdown('about.md')}
//             className="text-blue-600"
//           >
//             About
//           </button>
//         </li>
//       </ul>
//     </aside>
//   );
// };

// export default Sidebar;

// src/components/Sidebar.jsx
import React from 'react';

const Sidebar = ({ loadMarkdown }) => {
  return (
    <aside className="bg-gray-200 p-4">
      <h2 className="font-bold mb-2">Navigation</h2>
      <ul>
        <li className="mb-1">
          <button 
            onClick={() => loadMarkdown('home.md')}
            className="text-blue-600"
          >
            Home
          </button>
        </li>
        <li className="mb-1">
          <button 
            onClick={() => loadMarkdown('about.md')}
            className="text-blue-600"
          >
            About
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;

