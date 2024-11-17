import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-[#1B1E2B] border-b border-gray-700 z-50">
      <div className="flex items-center justify-between h-12 px-4">
        <Link to="/" className="text-white font-bold">
          Digital Garden
        </Link>
      </div>
    </nav>
  );
};

export default Navbar; 