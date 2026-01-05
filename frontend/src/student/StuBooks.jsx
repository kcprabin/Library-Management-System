import React, { useEffect, useState } from "react";
import { FaBook, FaSpinner, FaSearch } from "react-icons/fa";
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

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await getBooks();
      if (data?.Books) setBooks(data.Books);
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

  const handleBorrowBook = async () => {
    if (!selectedBook) return;
    try {
      setBorrowing(true);
      await borrowBook(selectedBook._id);
      toast.success(`Borrowed "${selectedBook.title}" successfully`);
      setSelectedBook(null);
    } catch (err) {
      toast.error(err.message || "Failed to borrow book");
    } finally {
      setBorrowing(false);
    }
  };

  const filteredBooks = books.filter((book) =>
    `${book.title} ${book.author} ${book.publication}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
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
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchBooks}
          className="mt-4 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-white mb-2">
          Available Books
        </h1>
        <p className="text-sm text-white">
          Browse and borrow books from the library
        </p>

      
        <div className="mt-4 max-w relative text-white">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white" />
          <input
            type="text"
            placeholder="Search by title, author, or publication..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
        </div>
      </div>

    
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <div
            key={book._id}
            className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
          >
           
            <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden rounded-t-xl">
              {book.image ? (
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaBook className="w-16 h-16 text-gray-300" />
              )}
            </div>

          
            <div className="p-4 flex flex-col h-[260px]">
              <h3 className="font-semibold text-lg text-gray-800 mb-1 line-clamp-2">
                {book.title}
              </h3>

              <p className="text-sm text-gray-600">
                <span className="font-medium">Author:</span> {book.author}
              </p>

              <p className="text-sm text-gray-600">
                <span className="font-medium">Publication:</span>{" "}
                {book.publication}
              </p>

              {book.publishedDate && (
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Year:</span>{" "}
                  {book.publishedDate}
                </p>
              )}

              {book.description && (
                <p className="text-sm text-gray-500 line-clamp-3 mb-4">
                  {book.description}
                </p>
              )}

              <button
                onClick={() => setSelectedBook(book)}
                className="mt-auto w-full bg-teal-600 text-white py-2.5 rounded-lg
                           hover:bg-teal-700 transition font-medium"
              >
                Borrow Book
              </button>
            </div>
          </div>
        ))}
      </div>

     
      {filteredBooks.length === 0 && (
        <div className="text-center py-16">
          <FaBook className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            {searchQuery
              ? "No books match your search"
              : "No books available"}
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
