import React, { useEffect, useState } from "react";
import { FaBook, FaSpinner } from "react-icons/fa";
import { getBooks, borrowBook } from "../fetch/index";
import toast from "react-hot-toast";
import ConfirmModal from "../componets/common/ConfirmModal";

function StuBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [borrowing, setBorrowing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  


  // Fetch books
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await getBooks();
      if (data && data.Books) setBooks(data.Books);
      else setError("Failed to load books");
    } catch (err) {
      setError(err.message || "Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Handle borrow book
  const handleBorrowBook = async () => {
    if (!selectedBook) return;
    
    try {
      setBorrowing(true);
      await borrowBook(selectedBook._id);
      toast.success(`Successfully borrowed "${selectedBook.title}"!`, 'success');
      setSelectedBook(null);
    } catch (err) {
      toast.error(err.message || 'Failed to borrow book', 'error');
    } finally {
      setBorrowing(false);
    }
  };


  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.publication.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <FaSpinner className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading books...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchBooks}
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
        <h1 className="text-2xl font-bold text-white mb-4">Available Books</h1>
        
        {/* Search Bar */}
        <div className="flex gap-2 max-w-2xl text-white">
          <input
            type="text"
            placeholder="Search by title, author, or publication..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

     
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <div key={book._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-200">
          
            <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
              {book.image ? (
                <img 
                  src={book.image} 
                  alt={book.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaBook className="w-16 h-16 text-gray-400" />
              )}
            </div>

            
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
                {book.title}
              </h3>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Author:</span> {book.author}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Publication:</span> {book.publication}
              </p>
              {book.publishedDate && (
                <p className="text-sm text-gray-600 mb-3">
                  <span className="font-semibold">Year:</span> {book.publishedDate}
                </p>
              )}
              
              {book.description && (
                <p className="text-sm text-gray-500 mb-4 line-clamp-3">
                  {book.description}
                </p>
              )}

              {/* Borrow Button */}
              <button
                onClick={() => setSelectedBook(book)}
                className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200 font-medium"
              >
                Borrow Book
              </button>
            </div>
          </div>
        ))}
      </div>

  
      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <FaBook className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            {searchQuery ? 'No books found matching your search' : 'No books available'}
          </p>
        </div>
      )}

     
      <ConfirmModal
        isOpen={selectedBook !== null}
        onClose={() => setSelectedBook(null)}
        onConfirm={handleBorrowBook}
        title="Borrow Book"
        message={`Are you sure you want to borrow "${selectedBook?.title}"?`}
        confirmText="Borrow"
        loading={borrowing}
      />
    </div>
  );
}

export default StuBooks;