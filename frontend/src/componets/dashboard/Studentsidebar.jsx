import React from 'react'
import { NavLink } from 'react-router-dom'
import { FaCheck, FaTachometerAlt, FaUsers, FaBook, FaThumbsUp, FaThumbsDown} from 'react-icons/fa'

const Studentsidebarsidebar = () => {
  return (
   <div className="w-64 h-screen bg-gray-800 text-white fixed left-0 top-0 shadow-lg">
  <div className="p-6 border-b border-gray-700">
    <h3 className="text-2xl font-bold text-center">Library MS</h3>
  </div>
  
  <div className="py-4">
    <NavLink 
      to="/admin-dashboard" 
      end
      className={({isActive}) => `flex items-center gap-3 px-6 py-3 hover:bg-gray-700 transition-colors duration-200 ${isActive ? "bg-teal-500" : ""}`}
    >
      <FaTachometerAlt className="text-lg" />
      <span>Dashboard</span>
    </NavLink>
    <NavLink 
      to="/admin-dashboard/members" 
      className={({isActive}) => `flex items-center gap-3 px-6 py-3 hover:bg-gray-700 transition-colors duration-200 ${isActive ? "bg-teal-500" : ""}`}
    >
      <FaBook className="text-lg" />
      <span>Books</span>
    </NavLink>
    <NavLink 
      to="/admin-dashboard/issued" 
      className={({isActive}) => `flex items-center gap-3 px-6 py-3 hover:bg-gray-700 transition-colors duration-200 ${isActive ? "bg-teal-500" : ""}`}
    >
     
      <FaThumbsUp className="text-lg" />
      <span>Returned</span>
    </NavLink>
    <NavLink 
      to="/admin-dashboard/not-returned" 
      className={({isActive}) => `flex items-center gap-3 px-6 py-3 hover:bg-gray-700 transition-colors duration-200 ${isActive ? "bg-teal-500" : ""}`}
    >
      <FaThumbsDown className="text-lg" />
      <span>Not Returned</span>
    </NavLink>
  </div>
</div>
  )
}

export default Studentsidebar