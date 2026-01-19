import React, { useEffect, useState } from 'react';
import { FaBook, FaSpinner, FaSearch, FaCalendarAlt, FaUser, FaCheckCircle } from 'react-icons/fa';

const BACKEND = import.meta.env.VITE_BACKEND;

const AdminReturned = () => {
  const [returnedBooks, setReturnedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchReturnedBooks();
  }, []);

  const fetchReturnedBooks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND}/api/v1/library/returned-books`, {
        credentials: 'include'
      });
      
      if (!res.ok) throw new Error('Failed to fetch books');
      
      const data = await res.json();
      
      const returned = data.books || [];
      setReturnedBooks(returned);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const stats = {
    total: returnedBooks.length,
    thisMonth: returnedBooks.filter(book => {
      const returnDate = book.returnedAt ? new Date(book.returnedAt) : new Date(book.updatedAt);
      const now = new Date();
      return returnDate.getMonth() === now.getMonth() && 
             returnDate.getFullYear() === now.getFullYear();
    }).length,
    thisWeek: returnedBooks.filter(book => {
      const returnDate = book.returnedAt ? new Date(book.returnedAt) : new Date(book.updatedAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return returnDate >= weekAgo;
    }).length
  };

  // Filter books by search
  const filteredBooks = returnedBooks.filter(book => 
    book.book?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.user?.studentemail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate borrowing duration
  const getBorrowDuration = (issuedAt, returnedAt) => {
    if (!issuedAt || !returnedAt) return null;
    const issued = new Date(issuedAt);
    const returned = new Date(returnedAt);
    const days = Math.ceil((returned - issued) / (1000 * 60 * 60 * 24));
    return days;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <FaSpinner className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading returned books...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">{error}</p>
        <button onClick={fetchReturnedBooks} className="mt-4 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Returned Books</h1>
        <p className="text-sm text-gray-500">Track all returned books and completion statistics</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Total Returns</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{stats.total}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FaCheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">This Month</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.thisMonth}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FaCalendarAlt className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg border border-purple-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">This Week</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{stats.thisWeek}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <FaBook className="w-6 h-6 text-purple-600" />
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
                       focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Books List */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
          <FaCheckCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No returned books</h3>
          <p className="text-gray-500">
            {searchTerm ? "No books match your search." : "No books have been returned yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBooks.map((issue) => {
            const returnDate = issue.returnedAt ? new Date(issue.returnedAt) : new Date(issue.updatedAt);
            const duration = getBorrowDuration(issue.issuedAt, issue.returnedAt || issue.updatedAt);

            return (
              <div key={issue._id} className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  {/* Book Image */}
                  <div className="w-16 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
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
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{issue.book?.title || 'Unknown Book'}</h3>
                        <p className="text-sm text-gray-600">by {issue.book?.author || 'Unknown Author'}</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        ✓ Returned
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <FaUser className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{issue.user?.studentemail || 'Unknown'}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="w-4 h-4 text-blue-400" />
                        <span className="text-gray-600">
                          Borrowed: {issue.issuedAt ? new Date(issue.issuedAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <FaCheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-gray-600">
                          Returned: {returnDate.toLocaleDateString()}
                        </span>
                      </div>

                      {duration && (
                        <div className="flex items-center gap-2">
                          <FaBook className="w-4 h-4 text-purple-400" />
                          <span className="text-gray-600">
                            Duration: {duration} day{duration !== 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
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
          Showing {filteredBooks.length} of {returnedBooks.length} returned books
        </div>
      )}
    </div>
  );
};

export default AdminReturned;