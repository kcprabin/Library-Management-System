import React, { useEffect, useState } from 'react'
import { FaBook, FaSpinner, FaCalendarAlt, FaExclamationTriangle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import ConfirmModal from '../componets/common/ConfirmModal';
import { getIssuedBooks } from '../fetch';
const Issue = () => {
  const [borrowedBooks , setBorrowedBooks] = useState([]);
  const [loading,setLoading] = useState(true);
  const[error,setError] = useState(null);
  const [selectedBook,setSelectedBook] = useState(null);
  const [returning,serReturning] = useState(false);

  const fetchBorrowedBooks = async()=> {
    try {
      setLoading(true);
      const data = await getIssuedBooks();

      const myBooks = data.books?.filter(book => book.status=== 'ISSUED') || [];
      setBorrowedBooks(myBooks);
    }
    catch(err)
    {
      setError(err.message || 'Failed to fetch borrowed books');
    }finally {
      setLoading(false);
    }
  };
  useEffect(()=>
  {
    fetchBorrowedBooks();
  },[]);
  const isOverdue = (issuedDate) => {
    const issued = new Date(issuedDate);
    const dueDate = new Date(issued);
    dueDate.setDate(dueDate.getDate()+ 14);
    return new Date() > dueDate;
  };
  const getDueDate =(issuedDate) => {
    const issued = new Date(issuedDate);
    const dueDate = new Date(issued);
    dueDate.setDate(dueDate.getDate()+14);
    return dueDate.toLocaleDateString();
  };
  const handleReturnBook = async()=>
  {
    if (!selectedBook) return;

  
  try {
    setReturning(true);
    //  Add API call to return book
      // await returnBook(selectedBook._id);
      toast.success(`Book returned successfully!`);
      setSelectedBook(null);
      fetchBorrowedBooks();
      
    }catch(err)
    {
      toast.error(err.message || 'Failed to return book');
    }finally{
      setReturning(false);
    }
  };

   if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <FaSpinner className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading your borrowed books...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchBorrowedBooks}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

   return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">My Borrowed Books</h1>
        <p className="text-gray-300">Books you currently have borrowed from the library</p>
      </div>

      {borrowedBooks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <FaBook className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Borrowed Books</h3>
          <p className="text-gray-500">You haven't borrowed any books yet. Visit the Books section to borrow some!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {borrowedBooks.map((issue) => {
            const overdue = isOverdue(issue.issuedAt);
            
            return (
              <div 
                key={issue._id} 
                className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-200 border-l-4 ${
                  overdue ? 'border-red-500' : 'border-green-500'
                }`}
              >
                {/* Book Image */}
                <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                  {issue.book?.image ? (
                    <img 
                      src={issue.book.image} 
                      alt={issue.book.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaBook className="w-16 h-16 text-gray-400" />
                  )}
                </div>

                {/* Book Details */}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
                    {issue.book?.title || 'Unknown Title'}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-3">
                    <span className="font-semibold">Author:</span> {issue.book?.author || 'Unknown'}
                  </p>

                  {/* Issue Date */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <FaCalendarAlt className="text-blue-500" />
                    <span>Issued: {new Date(issue.issuedAt).toLocaleDateString()}</span>
                  </div>

                  {/* Due Date */}
                  <div className={`flex items-center gap-2 text-sm mb-4 ${overdue ? 'text-red-600' : 'text-green-600'}`}>
                    {overdue && <FaExclamationTriangle />}
                    <span className="font-semibold">
                      Due: {getDueDate(issue.issuedAt)}
                    </span>
                  </div>

                  {overdue && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-2 mb-3">
                      <p className="text-xs text-red-700 font-semibold">
                         This book is overdue! Please return it as soon as possible.
                      </p>
                    </div>
                  )}

                  {/* Return Button */}
                  <button
                    onClick={() => setSelectedBook(issue)}
                    className={`w-full py-2 rounded-lg transition-colors duration-200 font-medium ${
                      overdue 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-teal-600 hover:bg-teal-700 text-white'
                    }`}
                  >
                    Return Book
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirm Return Modal */}
      <ConfirmModal
        isOpen={selectedBook !== null}
        onClose={() => setSelectedBook(null)}
        onConfirm={handleReturnBook}
        title="Return Book"
        message={`Are you sure you want to return "${selectedBook?.book?.title}"?`}
        confirmText="Return"
        loading={returning}
      />
    </div>
  );
}


export default Issue
