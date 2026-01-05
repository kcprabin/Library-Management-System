import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaBook, FaCalendarCheck, FaSpinner, FaSearch, FaHistory } from 'react-icons/fa';



const StuReturn = () => {
  const [returnedBooks, setReturnedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent'); 

  useEffect(() => {
    fetchReturnedBooks();
  }, []);

  const fetchReturnedBooks = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:8000/api/v1/library/seebook', {
        credentials: 'include'
      });
      
      if (!res.ok) throw new Error('Failed to fetch books');
      
      const data = await res.json();
      
      // Filter for returned books
      const returned = data.books?.filter(book => book.status === 'RETURNED') || [];
      setReturnedBooks(returned);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate reading statistics
  const stats = {
    totalReturned: returnedBooks.length,
    thisMonth: returnedBooks.filter(book => {
      const returnDate = book.returnedAt ? new Date(book.returnedAt) : new Date(book.updatedAt);
      const thisMonth = new Date();
      return returnDate.getMonth() === thisMonth.getMonth() && 
             returnDate.getFullYear() === thisMonth.getFullYear();
    }).length,
    onTime: returnedBooks.filter(book => {
      if (!book.issuedAt) return true;
      const issued = new Date(book.issuedAt);
      const returnDate = book.returnedAt ? new Date(book.returnedAt) : new Date(book.updatedAt);
      const dueDate = new Date(issued);
      dueDate.setDate(dueDate.getDate() + 14);
      return returnDate <= dueDate;
    }).length
  };

  // Calculate borrowing duration
  const getBorrowDuration = (issuedAt, returnedAt) => {
    if (!issuedAt || !returnedAt) return null;
    const issued = new Date(issuedAt);
    const returned = new Date(returnedAt);
    const days = Math.ceil((returned - issued) / (1000 * 60 * 60 * 24));
    return days;
  };

  // Filter and sort books
  let displayBooks = returnedBooks.filter(book =>
    book.book?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.book?.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort books
  displayBooks = [...displayBooks].sort((a, b) => {
    switch(sortBy) {
      case 'title':
        return (a.book?.title || '').localeCompare(b.book?.title || '');
      case 'author':
        return (a.book?.author || '').localeCompare(b.book?.author || '');
      case 'recent':
      default:
        const dateA = a.returnedAt ? new Date(a.returnedAt) : new Date(a.updatedAt);
        const dateB = b.returnedAt ? new Date(b.returnedAt) : new Date(b.updatedAt);
        return dateB - dateA;
    }
  });

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <FaSpinner className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium">Loading your history...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
          <h3 className="text-sm font-medium text-red-800">Error loading history</h3>
          <p className="mt-2 text-sm text-red-700">{error}</p>
          <button onClick={fetchReturnedBooks} className="mt-3 text-sm font-medium text-red-600 hover:text-red-500">
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
        <div className="flex items-center gap-3 mb-2">
          <FaHistory className="w-7 h-7 text-green-600" />
          <h1 className="text-2xl font-bold text-gray-900">Return History</h1>
        </div>
        <p className="text-sm text-gray-500">
          Your complete borrowing and return history
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700 mb-1">Total Returns</p>
              <p className="text-3xl font-bold text-green-900">{stats.totalReturned}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <FaCheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700 mb-1">This Month</p>
              <p className="text-3xl font-bold text-blue-900">{stats.thisMonth}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <FaCalendarCheck className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border-2 border-purple-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700 mb-1">On-Time Returns</p>
              <p className="text-3xl font-bold text-purple-900">
                {returnedBooks.length > 0 ? Math.round((stats.onTime / returnedBooks.length) * 100) : 0}%
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <FaCheckCircle className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search  */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
       
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search your history by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg 
                       focus:ring-2 focus:ring-green-500 focus:border-transparent 
                       text-gray-900 placeholder-gray-400"
          />
        </div>

        {/* Sort */}
        <div className="sm:w-48">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg 
                       focus:ring-2 focus:ring-green-500 focus:border-transparent 
                       text-gray-900 bg-white"
          >
            <option value="recent">Most Recent</option>
            <option value="title">By Title</option>
            <option value="author">By Author</option>
          </select>
        </div>
      </div>

      {/* Books List */}
      {displayBooks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
          <FaBook className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No matches found' : 'No return history yet'}
          </h3>
          <p className="text-gray-500">
            {searchTerm 
              ? `No books in your history match "${searchTerm}"`
              : "Books you return will appear here. Start borrowing to build your reading history!"
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayBooks.map((issue) => {
            const returnDate = issue.returnedAt ? new Date(issue.returnedAt) : new Date(issue.updatedAt);
            const borrowDuration = getBorrowDuration(issue.issuedAt, issue.returnedAt || issue.updatedAt);
            
            // Check if returned on time
            let wasOnTime = true;
            if (issue.issuedAt) {
              const issued = new Date(issue.issuedAt);
              const dueDate = new Date(issued);
              dueDate.setDate(dueDate.getDate() + 14);
              wasOnTime = returnDate <= dueDate;
            }

            return (
              <div
                key={issue._id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Book Image */}
                    <div className="w-20 h-28 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                      {issue.book?.image ? (
                        <img 
                          src={issue.book.image} 
                          alt={issue.book.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FaBook className="w-8 h-8 text-gray-300" />
                        </div>
                      )}
                    </div>

                    {/* Book Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0 pr-4">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {issue.book?.title || 'Unknown Book'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            by {issue.book?.author || 'Unknown Author'}
                          </p>
                        </div>
                        
                        {/* Status Badge */}
                        <span className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold
                          ${wasOnTime 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-orange-100 text-orange-700'
                          }`}>
                          {wasOnTime ? '✓ On Time' : '⚠ Late'}
                        </span>
                      </div>

                      {/* Timeline */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <FaCalendarCheck className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Borrowed</p>
                            <p className="font-medium text-gray-900">
                              {issue.issuedAt ? new Date(issue.issuedAt).toLocaleDateString() : 'N/A'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <FaCheckCircle className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Returned</p>
                            <p className="font-medium text-gray-900">
                              {returnDate.toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {borrowDuration && (
                          <div className="flex items-center gap-2 text-sm">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <FaBook className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Duration</p>
                              <p className="font-medium text-gray-900">
                                {borrowDuration} day{borrowDuration !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                        )}
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
      {displayBooks.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-600">
          Showing {displayBooks.length} of {returnedBooks.length} returned books
        </div>
      )}

      {/* Encouragement Footer */}
      {returnedBooks.length > 0 && (
        <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 p-5">
          <div className="flex items-start gap-3">
            <FaCheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-green-900 mb-1">Great Reading Habits! 📚</h4>
              <p className="text-sm text-green-700">
                You've returned {stats.totalReturned} book{stats.totalReturned !== 1 ? 's' : ''} so far. 
                {stats.onTime === returnedBooks.length && ' All on time! '}
                Keep exploring and discovering new books!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StuReturn;