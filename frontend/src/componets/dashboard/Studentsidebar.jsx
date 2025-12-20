import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaBook, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

const StudentSidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white fixed left-0 top-0 shadow-lg">
      <div className="p-6 border-b border-gray-700">
        <h3 className="text-2xl font-bold text-center">Library MS</h3>
      </div>

      <div className="py-4">
        <NavLink 
          to="/student-dashboard" 
          end
          className={({isActive}) => `flex items-center gap-3 px-6 py-3 hover:bg-gray-700 transition-colors duration-200 ${isActive ? "bg-teal-500 rounded-lg" : ""}`}
        >
          <FaTachometerAlt className="text-lg" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink 
          to="/student-dashboard/books" 
          className={({isActive}) => `flex items-center gap-3 px-6 py-3 hover:bg-gray-700 transition-colors duration-200 ${isActive ? "bg-teal-500 rounded-lg" : ""}`}
        >
          <FaBook className="text-lg" />
          <span>Books</span>
        </NavLink>
        <NavLink 
          to="/student-dashboard/returned" 
          className={({isActive}) => `flex items-center gap-3 px-6 py-3 hover:bg-gray-700 transition-colors duration-200 ${isActive ? "bg-teal-500 rounded-lg" : ""}`}
        >
          <FaThumbsUp className="text-lg" />
          <span>Returned</span>
        </NavLink>
        <NavLink 
          to="/student-dashboard/not-returned" 
          className={({isActive}) => `flex items-center gap-3 px-6 py-3 hover:bg-gray-700 transition-colors duration-200 ${isActive ? "bg-teal-500 rounded-lg" : ""}`}
        >
          <FaThumbsDown className="text-lg" />
          <span>Not Returned</span>
        </NavLink>
      </div>
    </div>
  );
};

export default StudentSidebar;
