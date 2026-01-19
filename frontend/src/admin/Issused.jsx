import React, { useEffect, useState } from 'react';
import { FaBook, FaSpinner, FaSearch, FaCalendarAlt, FaUser, FaExclamationTriangle, FaClock } from 'react-icons/fa';

const BACKEND = import.meta.env.VITE_BACKEND || "http://localhost:8000";


const Issused = () => {
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'due-soon', 'overdue'

  useEffect(() => {
    fetchIssuedBooks();
  }, []);

  const fetchIssuedBooks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND}/api/v1/library/issued-books`, {
        credentials: 'include'
      });
      
      if (!res.ok) throw new Error('Failed to fetch issued books');
      
      const data = await res.json();
      const issued = data.books || [];
      setIssuedBooks(issued);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate days until due (14 days from issue date)
  const getDaysUntilDue = (issuedDate) => {
    const issued = new Date(issuedDate);
    const dueDate = new Date(issued);
    dueDate.setDate(dueDate.getDate() + 14);
    
    const today = new Date();
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // Get status category
  const getStatus = (issuedDate) => {
    const daysLeft = getDaysUntilDue(issuedDate);
    if (daysLeft < 0) return 'overdue';
    if (daysLeft <= 3) return 'due-soon';
    return 'active';
  };

  // Get status color and label
  const getStatusInfo = (status) => {
    switch(status) {
      case 'overdue':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-700',
          badge: 'bg-red-100 text-red-800',
          label: 'Overdue',
          icon: FaExclamationTriangle
        };
      case 'due-soon':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-700',
          badge: 'bg-yellow-100 text-yellow-800',
          label: 'Due Soon',
          icon: FaClock
        };
      default:
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-700',
          badge: 'bg-green-100 text-green-800',
          label: 'Active',
          icon: FaBook
        };
    }
  };

  // Filter books
  const filteredBooks = issuedBooks.filter(issue => {
    const matchesSearch = 
      issue.book?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.student?.studentemail?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const status = getStatus(issue.issuedAt);
    const matchesFilter = statusFilter === 'all' || status === statusFilter;
    
    return matchesSearch && matchesFilter;
  });

  // Calculate stats
  const stats = {
    total: issuedBooks.length,
    active: issuedBooks.filter(i => getStatus(i.issuedAt) === 'active').length,
    dueSoon: issuedBooks.filter(i => getStatus(i.issuedAt) === 'due-soon').length,
    overdue: issuedBooks.filter(i => getStatus(i.issuedAt) === 'overdue').length,
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <FaSpinner className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium">Loading issued books...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
          <h3 className="text-sm font-medium text-red-800">Error loading issued books</h3>
          <p className="mt-2 text-sm text-red-700">{error}</p>
          <button onClick={fetchIssuedBooks} className="mt-3 text-sm font-medium text-red-600 hover:text-red-500">
            Try again →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Issued Books Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track and manage currently borrowed books
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Issued</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-lg">
              <FaBook className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div 
          className={`rounded-lg border p-4 shadow-sm cursor-pointer transition-all
            ${statusFilter === 'active' ? 'bg-green-100 border-green-300' : 'bg-white border-gray-200 hover:bg-green-50'}`}
          onClick={() => setStatusFilter(statusFilter === 'active' ? 'all' : 'active')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-700 mt-1">{stats.active}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FaBook className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div 
          className={`rounded-lg border p-4 shadow-sm cursor-pointer transition-all
            ${statusFilter === 'due-soon' ? 'bg-yellow-100 border-yellow-300' : 'bg-white border-gray-200 hover:bg-yellow-50'}`}
          onClick={() => setStatusFilter(statusFilter === 'due-soon' ? 'all' : 'due-soon')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Due Soon</p>
              <p className="text-2xl font-bold text-yellow-700 mt-1">{stats.dueSoon}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <FaClock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div 
          className={`rounded-lg border p-4 shadow-sm cursor-pointer transition-all
            ${statusFilter === 'overdue' ? 'bg-red-100 border-red-300' : 'bg-white border-gray-200 hover:bg-red-50'}`}
          onClick={() => setStatusFilter(statusFilter === 'overdue' ? 'all' : 'overdue')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-700 mt-1">{stats.overdue}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <FaExclamationTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex-1 relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by book title or student email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg 
                       focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                       text-gray-900 placeholder-gray-400"
          />
        </div>
        
        {statusFilter !== 'all' && (
          <button
            onClick={() => setStatusFilter('all')}
            className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 
                       transition-colors text-sm font-medium whitespace-nowrap"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Issued Books List */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
          <FaBook className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No issued books found</h3>
          <p className="text-gray-500">
            {searchTerm || statusFilter !== 'all'
              ? "No books match your search criteria."
              : "No books are currently issued."
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredBooks.map((issue) => {
            const status = getStatus(issue.issuedAt);
            const statusInfo = getStatusInfo(status);
            const StatusIcon = statusInfo.icon;
            const daysLeft = getDaysUntilDue(issue.issuedAt);
            const dueDate = new Date(issue.issuedAt);
            dueDate.setDate(dueDate.getDate() + 14);

            return (
              <div
                key={issue._id}
                className={`${statusInfo.bg} ${statusInfo.border} border-2 rounded-xl p-5 
                           hover:shadow-lg transition-all duration-200`}
              >
               
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <FaBook className="w-6 h-6 text-gray-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-lg truncate">
                        {issue.book?.title || 'Unknown Book'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        by {issue.book?.author || 'Unknown Author'}
                      </p>
                    </div>
                  </div>
                  <span className={`${statusInfo.badge} px-3 py-1 rounded-full text-xs font-semibold 
                                   flex items-center gap-1.5 whitespace-nowrap`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {statusInfo.label}
                  </span>
                </div>

                {/* Student Info */}
                <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-white rounded-lg">
                  <FaUser className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700 font-medium">
                    {issue.student?.userName || 'Unknown Student'}
                  </span>
                </div>

                {/* Date Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-2">
                      <FaCalendarAlt className="w-4 h-4" />
                      Issued:
                    </span>
                    <span className="font-medium text-gray-900">
                      {new Date(issue.issuedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-2">
                      <FaCalendarAlt className="w-4 h-4" />
                      Due Date:
                    </span>
                    <span className={`font-medium ${statusInfo.text}`}>
                      {dueDate.toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Days Left Indicator */}
                <div className="bg-white rounded-lg p-3">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">
                      {daysLeft >= 0 ? `${daysLeft} day(s) left` : `${Math.abs(daysLeft)} day(s) overdue`}
                    </span>
                    <span className={`font-semibold ${statusInfo.text}`}>
                      {Math.round(((14 - Math.abs(daysLeft)) / 14) * 100)}%
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        status === 'overdue' ? 'bg-red-600' :
                        status === 'due-soon' ? 'bg-yellow-600' :
                        'bg-green-600'
                      }`}
                      style={{ width: `${Math.max(0, Math.min(100, ((14 - Math.abs(daysLeft)) / 14) * 100))}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Results Count */}
      {filteredBooks.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-600">
          Showing {filteredBooks.length} of {issuedBooks.length} issued books
        </div>
      )}
    </div>
  );
};

export default Issused;