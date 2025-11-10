import React from 'react';
import { Menu, Home, RefreshCw, ChevronDown } from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
  return (
    <div className="h-16 bg-white shadow-sm flex items-center px-5 fixed top-0 left-0 right-0 z-50">
      <button 
        onClick={toggleSidebar}
        className="w-10 h-10 flex items-center justify-center rounded text-gray-800 hover:bg-gray-100"
      >
        <Menu size={18} />
      </button>

      <div className="ml-5 flex gap-2.5">
        <a href="/ManageCompany" className="px-4 py-2 rounded border border-gray-300 bg-white text-gray-800 text-sm font-medium flex items-center hover:bg-gray-50">
          <Home size={16} className="mr-1" />
          Home
        </a>
        <button className="px-4 py-2 rounded border border-gray-300 bg-white text-gray-800 text-sm font-medium flex items-center hover:bg-gray-50">
          <RefreshCw size={16} className="mr-1" />
          Refresh
        </button>
      </div>

      <div className="ml-auto flex items-center cursor-pointer border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50">
        <span className="mr-2 text-sm font-medium">jobanpreet@xpertlogs</span>
        <ChevronDown size={12} className="opacity-60" />
      </div>
    </div>
    
  );
};

export default Navbar;