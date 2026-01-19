import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaSearch, FaBook, FaSpinner, FaEdit, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import { deleteBook, editBook } from "../fetch";
import ConfirmModal from "../componets/common/ConfirmModal";

const BACKEND = import.meta.env.VITE_BACKEND;



function AdminBooks() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingBook, setEditingBook] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleting, setDeleting] = useState(null);

  // Fetch books from API
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND}/api/v1/library/getbooks`, { 
        credentials: 'include' 
      });
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const data = await res.json();
      if (data && data.Books) setBooks(data.Books);
      else setError("Unexpected response format");
    } catch (err) {
      setError(err.message || "Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete book
  const handleDeleteBook = async (bookId) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    
    try {
      setDeleting(bookId);
      await deleteBook(bookId);
      setBooks((prev) => prev.filter((b) => b._id !== bookId));
      toast.success("Book deleted successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to delete book");
    } finally {
      setDeleting(null);
    }
  };

  // Handle edit book
  const handleEditClick = (book) => {
    setEditingBook(book._id);
    setEditForm({
      title: book.title,
      author: book.author,
      publishedDate: book.publishedDate,
      publication: book.publication,
      description: book.description || ""
    });
  };

  // Save edited book
  const handleSaveEdit = async () => {
    try {
      setLoading(true);
      await editBook(editingBook, editForm);
      setBooks((prev) => prev.map((b) => 
        b._id === editingBook ? { ...b, ...editForm } : b
      ));
      toast.success("Book updated successfully!");
      setEditingBook(null);
      setEditForm({});
    } catch (err) {
      toast.error(err.message || "Failed to update book");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Filter books based on search term
  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading skeleton
  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <FaSpinner className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium">Loading books...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-red-800">Error loading books</h3>
              <p className="mt-2 text-sm text-red-700">{error}</p>
              <button 
                onClick={fetchBooks}
                className="mt-3 text-sm font-medium text-red-600 hover:text-red-500"
              >
                Try again →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
     
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black-900">Books Management</h1>
          <p className="mt-1 text-sm text-black-500">
            Manage your library's book collection
          </p>
        </div>
        
        
        <button
          onClick={() => navigate('/new-book')}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 
                     text-white font-medium rounded-lg shadow-md hover:shadow-lg 
                     hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 
                     transition-all duration-200"
        >
          <FaPlus className="w-4 h-4" />
          Add New Book
        </button>
      </div>

    
      <div className="mb-6">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg 
                       focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                       text-gray-900 placeholder-gray-400
                       transition-all duration-200"
          />
        </div>
       
        {searchTerm && (
          <p className="mt-2 text-sm text-gray-600">
            Found {filteredBooks.length} book(s) matching "{searchTerm}"
          </p>
        )}
      </div>

    
      {filteredBooks.length === 0 ? (
        // Empty state
        <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
          <FaBook className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
          <p className="text-gray-500">
            {searchTerm 
              ? `No books match "${searchTerm}". Try a different search.`
              : "Get started by adding your first book."
            }
          </p>
          {!searchTerm && (
            <button
              onClick={() => navigate('/new-book')}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white 
                         rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <FaPlus className="w-4 h-4" />
              Add Your First Book
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book._id}
              className="group bg-white rounded-xl border border-gray-200 shadow-sm 
                         hover:shadow-xl hover:-translate-y-1 transition-all duration-300 
                         overflow-hidden"
            >
             
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                {book.image ? (
                  <>
                    <img 
                      src={book.image} 
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent 
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <FaBook className="w-16 h-16 text-gray-300" />
                  </div>
                )}
                
                
                {book.publishedDate && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold 
                                   text-gray-700 rounded-full shadow-sm">
                      {book.publishedDate}
                    </span>
                  </div>
                )}
              </div>

             
              <div className="p-4">
               
                <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 
                               group-hover:text-indigo-600 transition-colors">
                  {book.title}
                </h3>

               
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium text-gray-700">By</span> {book.author}
                </p>

                <p className="text-sm text-gray-500 mb-3">
                  {book.publication}
                </p>

               
                {book.description && (
                  <p className="text-xs text-gray-500 line-clamp-2 mb-4">
                    {book.description}
                  </p>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(book)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 
                               bg-indigo-50 text-indigo-600 rounded-lg 
                               hover:bg-indigo-100 transition-colors text-sm font-medium"
                  >
                    <FaEdit className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBook(book._id)}
                    disabled={deleting === book._id}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 
                               bg-red-50 text-red-600 rounded-lg 
                               hover:bg-red-100 transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    {deleting === book._id ? (
                      <FaSpinner className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <FaTrash className="w-3.5 h-3.5" />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingBook && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Edit Book</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                  <input
                    type="text"
                    value={editForm.author}
                    onChange={(e) => setEditForm({...editForm, author: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Published Date</label>
                  <input
                    type="number"
                    value={editForm.publishedDate}
                    onChange={(e) => setEditForm({...editForm, publishedDate: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Publication</label>
                  <input
                    type="text"
                    value={editForm.publication}
                    onChange={(e) => setEditForm({...editForm, publication: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows="3"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setEditingBook(null);
                    setEditForm({});
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminBooks;