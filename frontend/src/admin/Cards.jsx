import React from 'react'
import { FaBook, FaUsers, FaHandshake, FaUndoAlt, FaExclamationTriangle } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'

const Main = () => {
  return(
   <div>
    <div className="pl-69">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        

        {/* Members Card */}
         <NavLink 
       to={"Members"}>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-2">Total Members</p>
              <p className="text-5xl font-bold">128</p>
            </div>
             <div className="p-4 rounded-full">
              <FaUsers className="w-12 h-12"/>
            </div>
          </div>
        </div>
      </NavLink>

        {/* Books Card */}
        <NavLink 
        to={"books"}>
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200" >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-100 text-sm font-medium mb-2">Total Books</p>
              <p className="text-5xl font-bold">245</p>
            </div>
            <div className="p-4 rounded-full">
              <FaBook className="w-12 h-12"/>
            </div>
          </div>
        </div>
        </NavLink>

        
      

        {/* Issued Books Card */}
        <NavLink to={"issued"}>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium mb-2">Books Issued</p>
              <p className="text-5xl font-bold">42</p>

            </div>
             <div className="p-4 rounded-full">
              <FaHandshake className="w-12 h-12"/>
            </div>
          </div>
        </div>
        </NavLink>

        {/* Returned Books Card */}
        <NavLink to={"returned"}>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium mb-2">Books Returned</p>
              <p className="text-5xl font-bold">189</p>
            
            </div>
             <div className="p-4 rounded-full">
              <FaUndoAlt className="w-12 h-12"/>
            </div>
          </div>
        </div>
        </NavLink>

        {/* Overdue Books Card */}
        <NavLink to={"not-returned"}>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium mb-2">Books Not Returned</p>
              <p className="text-5xl font-bold">7</p>
              
            </div>
           <div className="p-4 rounded-full">
              <FaExclamationTriangle className="w-12 h-12"/>
            </div>
          </div>
        </div>
        </NavLink>

      </div>
      </div>
    </div>
  )
}

export default Main