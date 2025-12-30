import React from 'react'
import { FaBook, FaUsers, FaHandshake, FaUndoAlt, FaExclamationTriangle } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'

const StuCards = () => {
  return(
   <div>
    <div className="pl-4 md:pl-0">
      <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">My Dashboard</h1>
      <p className="text-gray-200 mb-8 drop-shadow-md">Track your borrowed books and reading progress.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        


        {/* Books Card */}
        <NavLink 
        to={"books"}>
        <div className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-xl shadow-2xl p-6 text-white transform hover:scale-105 transition-all duration-300 backdrop-blur-sm bg-opacity-90 border border-teal-400 border-opacity-30" >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-200 text-sm font-semibold mb-2 uppercase tracking-wide">Total Books</p>
              <p className="text-5xl font-bold drop-shadow-lg">245</p>
            </div>
            <div className="p-4 rounded-full bg-teal-500 bg-opacity-30 backdrop-blur">
              <FaBook className="w-12 h-12 text-teal-100"/>
            </div>
          </div>
        </div>
        </NavLink>


        {/* Returned Books Card */}
        <NavLink to={"returned"}>
        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl shadow-2xl p-6 text-white transform hover:scale-105 transition-all duration-300 backdrop-blur-sm bg-opacity-90 border border-green-400 border-opacity-30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200 text-sm font-semibold mb-2 uppercase tracking-wide">Books Returned</p>
              <p className="text-5xl font-bold drop-shadow-lg">189</p>
            
            </div>
             <div className="p-4 rounded-full bg-green-500 bg-opacity-30 backdrop-blur">
              <FaUndoAlt className="w-12 h-12 text-green-100"/>
            </div>
          </div>
        </div>
        </NavLink>

        {/* Overdue Books Card */}
        <NavLink to={"not-returned"}>
        <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-xl shadow-2xl p-6 text-white transform hover:scale-105 transition-all duration-300 backdrop-blur-sm bg-opacity-90 border border-red-400 border-opacity-30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-200 text-sm font-semibold mb-2 uppercase tracking-wide">Books Not Returned</p>
              <p className="text-5xl font-bold drop-shadow-lg">7</p>
              
            </div>
           <div className="p-4 rounded-full bg-red-500 bg-opacity-30 backdrop-blur">
              <FaExclamationTriangle className="w-12 h-12 text-red-100"/>
            </div>
          </div>
        </div>
        </NavLink>

      </div>
      </div>
    </div>
  )
}

export default StuCards