import React, { useEffect, useState } from 'react';
import { FaExclamationTriangle, FaSpinner, FaSearch, FaCalendarAlt, FaUser, FaBook } from 'react-icons/fa';

const BACKEND = import.meta.env.VITE_BACKEND || "http://localhost:8000";

const AdminNotReturn = () => {
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOverdueBooks();
  }, []);

  const fetchOverdueBooks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND}/api/v1/library/overdue-books`, {
        credentials: 'include'
      });
      
      if (!res.ok) throw new Error('Failed to fetch books');
      
      const data = await res.json();
      
      const overdue = data.books || [];
      setOverdueBooks(overdue);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate how many days overdue
  const getDaysOverdue = (issuedAt) => {
    const issued = new Date(issuedAt);
    const dueDate = new Date(issued);
    dueDate.setDate(dueDate.getDate() + 14);
    
    const now = new Date();
    const diffTime = now - dueDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // Get urgency level
  const getUrgencyLevel = (daysOverdue) => {
    if (daysOverdue > 30) return { level: 'critical', color: 'red', label: 'Critical' };
    if (daysOverdue > 14) return { level: 'high', color: 'orange', label: 'High' };
    return { level: 'medium', color: 'yellow', label: 'Medium' };
  };

  // Filter books
  const filteredBooks = overdueBooks.filter(book =>
    book.book?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.user?.studentemail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate statistics
  const stats = {
    total: overdueBooks.length,
    critical: overdueBooks.filter(b => getDaysOverdue(b.issuedAt) > 30).length,
    high: overdueBooks.filter(b => {
      const days = getDaysOverdue(b.issuedAt);
      return days > 14 && days <= 30;
    }).length,
    medium: overdueBooks.filter(b => {
      const days = getDaysOverdue(b.issuedAt);
      return days > 0 && days <= 14;
    }).length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <FaSpinner className="w-12 h-12 text-red-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading overdue books...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">{error}</p>
        <button onClick={fetchOverdueBooks} className="mt-4 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black-900">Overdue Books</h1>
        <p className="text-sm text-black-500">Books that have passed their 14-day return deadline</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Total Overdue</p>
              <p className="text-2xl font-bold text-red-900 mt-1">{stats.total}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <FaExclamationTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-100 to-red-200 rounded-lg border border-red-300 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700">Critical (30+ days)</p>
              <p className="text-2xl font-bold text-red-900 mt-1">{stats.critical}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">High (15-30 days)</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">{stats.high}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-700">Medium (1-14 days)</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.medium}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by book title or student email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg 
                       focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Books List */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
          <FaExclamationTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No matches found' : 'No overdue books'}
          </h3>
          <p className="text-gray-500">
            {searchTerm ? "No overdue books match your search." : "Great! All books are returned on time."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBooks.map((issue) => {
            const daysOverdue = getDaysOverdue(issue.issuedAt);
            const urgency = getUrgencyLevel(daysOverdue);
            const issuedDate = new Date(issue.issuedAt);
            const dueDate = new Date(issuedDate);
            dueDate.setDate(dueDate.getDate() + 14);

            const urgencyColors = {
              critical: 'bg-red-50 border-red-300',
              high: 'bg-orange-50 border-orange-300',
              medium: 'bg-yellow-50 border-yellow-300'
            };

            const badgeColors = {
              critical: 'bg-red-100 text-red-800',
              high: 'bg-orange-100 text-orange-800',
              medium: 'bg-yellow-100 text-yellow-800'
            };

            return (
              <div 
                key={issue._id} 
                className={`rounded-lg border-2 p-5 shadow-sm ${urgencyColors[urgency.level]}`}
              >
                <div className="flex items-start gap-4">
                  {/* Book Image */}
                  <div className="w-16 h-24 bg-white rounded-lg flex-shrink-0 overflow-hidden shadow-sm">
                    {issue.book?.image ? (
                      <img src={issue.book.image} alt={issue.book.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaBook className="w-6 h-6 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Book Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{issue.book?.title || 'Unknown Book'}</h3>
                        <p className="text-sm text-gray-600">by {issue.book?.author || 'Unknown Author'}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${badgeColors[urgency.level]}`}>
                          <FaExclamationTriangle className="w-3 h-3" />
                          {urgency.label}
                        </span>
                        <span className="text-sm font-semibold text-red-700">
                          {daysOverdue} day{daysOverdue !== 1 ? 's' : ''} overdue
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <FaUser className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700 font-medium">{issue.user?.studentemail || 'Unknown'}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="w-4 h-4 text-blue-400" />
                        <span className="text-gray-600">
                          Issued: {issuedDate.toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="w-4 h-4 text-red-400" />
                        <span className="text-red-600 font-medium">
                          Due: {dueDate.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
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
          Showing {filteredBooks.length} of {overdueBooks.length} overdue books
        </div>
      )}
    </div>
  );
};

export default AdminNotReturn;