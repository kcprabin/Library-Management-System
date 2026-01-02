import React from 'react';
import { FaBook, FaHandshake, FaUndoAlt, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { useDashboardStats } from '../hooks/useDashboardStats';

const StuCards = () => {
  const { stats, loading, error } = useDashboardStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <FaSpinner className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <FaExclamationTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Student Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Available Books */}
        <NavLink to="books">
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-100 text-sm font-medium mb-2">Available Books</p>
                <p className="text-5xl font-bold">{stats.totalBooks}</p>
              </div>
              <div className="p-4 bg-teal-600 bg-opacity-30 rounded-full">
                <FaBook className="w-12 h-12"/>
              </div>
            </div>
          </div>
        </NavLink>

        {/* Book Issues (My Borrowed Books) */}
        <NavLink to="Issue">
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium mb-2">My Borrowed Books</p>
                <p className="text-5xl font-bold">{stats.booksIssued}</p>
              </div>
              <div className="p-4 bg-yellow-600 bg-opacity-30 rounded-full">
                <FaHandshake className="w-12 h-12"/>
              </div>
            </div>
          </div>
        </NavLink>

        {/* Returned Books */}
        <NavLink to="returned">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium mb-2">Returned Books</p>
                <p className="text-5xl font-bold">{stats.booksReturned}</p>
              </div>
              <div className="p-4 bg-green-600 bg-opacity-30 rounded-full">
                <FaUndoAlt className="w-12 h-12"/>
              </div>
            </div>
          </div>
        </NavLink>

      </div>
    </div>
  );
};

export default StuCards;