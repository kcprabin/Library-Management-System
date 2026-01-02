import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaCheck, FaTachometerAlt, FaUsers, FaBook, FaThumbsUp, FaThumbsDown, FaTimes } from 'react-icons/fa';



const Adminsidebar = ({ isOpen, setIsOpen }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-gray-900/80 via-gray-800/70 to-gray-900/80 text-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-r border-teal-500 border-opacity-30 backdrop-blur-sm
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center gap-1">
              <img
                   src="/images/logo.png"
                   className="h-15 w-15 object-contain object-[6] "
                   alt="Yr Library Logo"
                   />
             <h3 className="text-xl font-bold tracking-wide">
                 Yr Library
              </h3>
        </div>
        <div>
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-white hover:text-teal-300 transition-colors hover:bg-teal-500 hover:bg-opacity-20 p-2 rounded-lg"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="py-4 space-y-2 px-3">
          <NavLink 
            to="/admin-dashboard" 
            end
            onClick={() => setIsOpen(false)}
            className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${isActive ? "bg-gradient-to-r from-teal-500 to-teal-600 shadow-lg shadow-teal-500/50 text-white font-semibold" : "hover:bg-gray-700 hover:bg-opacity-50 text-gray-300 hover:text-white"}`}
          >
            <FaTachometerAlt className="text-lg" />
            <span>Dashboard</span>
          </NavLink>
          
          <NavLink 
            to="/admin-dashboard/members" 
            onClick={() => setIsOpen(false)}
            className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${isActive ? "bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/50 text-white font-semibold" : "hover:bg-gray-700 hover:bg-opacity-50 text-gray-300 hover:text-white"}`}
          >
            <FaUsers className="text-lg" />
            <span>Members</span>
          </NavLink>
          
          <NavLink 
            to="/admin-dashboard/books" 
            onClick={() => setIsOpen(false)}
            className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${isActive ? "bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg shadow-purple-500/50 text-white font-semibold" : "hover:bg-gray-700 hover:bg-opacity-50 text-gray-300 hover:text-white"}`}
          >
            <FaBook className="text-lg" />
            <span>Books</span>
          </NavLink>
          
          <NavLink 
            to="/admin-dashboard/issued" 
            onClick={() => setIsOpen(false)}
            className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${isActive ? "bg-gradient-to-r from-yellow-500 to-yellow-600 shadow-lg shadow-yellow-500/50 text-white font-semibold" : "hover:bg-gray-700 hover:bg-opacity-50 text-gray-300 hover:text-white"}`}
          >
            <FaCheck className="text-lg" />
            <span>Issues</span>
          </NavLink>
          
          <NavLink 
            to="/admin-dashboard/returned" 
            onClick={() => setIsOpen(false)}
            className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${isActive ? "bg-gradient-to-r from-green-500 to-green-600 shadow-lg shadow-green-500/50 text-white font-semibold" : "hover:bg-gray-700 hover:bg-opacity-50 text-gray-300 hover:text-white"}`}
          >
            <FaThumbsUp className="text-lg" />
            <span>Returned</span>
          </NavLink>
          
          <NavLink 
            to="/admin-dashboard/not-returned" 
            onClick={() => setIsOpen(false)}
            className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${isActive ? "bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-500/50 text-white font-semibold" : "hover:bg-gray-700 hover:bg-opacity-50 text-gray-300 hover:text-white"}`}
          >
            <FaThumbsDown className="text-lg" />
            <span>Not Returned</span>
          </NavLink>
        </nav>
      </div>
    </>
  );
};

export default Adminsidebar;
