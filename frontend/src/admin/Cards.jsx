import React from 'react';
import { FaBook, FaUsers, FaHandshake, FaUndoAlt, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { useDashboardStats } from '../hooks/useDashboardStats';

const Cards = () => {
  const { stats, loading, error } = useDashboardStats();

  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <FaSpinner className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading dashboard statistics...</p>
        </div>
      </div>
    );
  }

  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <FaExclamationTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Statistics</h3>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
      
        <NavLink to="members">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-2">Total Members</p>
                <p className="text-5xl font-bold">{stats.totalMembers}</p>
              </div>
              <div className="p-4 bg-blue-600 bg-opacity-30 rounded-full">
                <FaUsers className="w-12 h-12"/>
              </div>
            </div>
          </div>
        </NavLink>

       
        <NavLink to="books">
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-100 text-sm font-medium mb-2">Total Books</p>
                <p className="text-5xl font-bold">{stats.totalBooks}</p>
              </div>
              <div className="p-4 bg-teal-600 bg-opacity-30 rounded-full">
                <FaBook className="w-12 h-12"/>
              </div>
            </div>
          </div>
        </NavLink>

      
        <NavLink to="issued">
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium mb-2">Books Issued</p>
                <p className="text-5xl font-bold">{stats.booksIssued}</p>
              </div>
              <div className="p-4 bg-yellow-600 bg-opacity-30 rounded-full">
                <FaHandshake className="w-12 h-12"/>
              </div>
            </div>
          </div>
        </NavLink>

       
        <NavLink to="returned">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium mb-2">Books Returned</p>
                <p className="text-5xl font-bold">{stats.booksReturned}</p>
              </div>
              <div className="p-4 bg-green-600 bg-opacity-30 rounded-full">
                <FaUndoAlt className="w-12 h-12"/>
              </div>
            </div>
          </div>
        </NavLink>

        <NavLink to="not-returned">
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium mb-2">Books Overdue</p>
                <p className="text-5xl font-bold">{stats.booksNotReturned}</p>
              </div>
              <div className="p-4 bg-red-600 bg-opacity-30 rounded-full">
                <FaExclamationTriangle className="w-12 h-12"/>
              </div>
            </div>
          </div>
        </NavLink>

      </div>
    </div>
  );
};

export default Cards;