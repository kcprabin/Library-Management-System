import React, { useEffect, useState } from "react";
import {
  FaBook,
  FaSpinner,
  FaCalendarAlt,
  FaExclamationTriangle,
} from "react-icons/fa";
import toast from "react-hot-toast";
import ConfirmModal from "../componets/common/ConfirmModal";
import { getIssuedBooks } from "../fetch";

const Issue = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [returning, serReturning] = useState(false);

  const fetchBorrowedBooks = async () => {
    try {
      setLoading(true);
      const data = await getIssuedBooks();
      const myBooks =
        data.books?.filter((book) => book.status === "ISSUED") || [];
      setBorrowedBooks(myBooks);
    } catch (err) {
      setError(err.message || "Failed to fetch borrowed books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  const isOverdue = (issuedDate) => {
    const issued = new Date(issuedDate);
    const dueDate = new Date(issued);
    dueDate.setDate(dueDate.getDate() + 14);
    return new Date() > dueDate;
  };

  const getDueDate = (issuedDate) => {
    const issued = new Date(issuedDate);
    const dueDate = new Date(issued);
    dueDate.setDate(dueDate.getDate() + 14);
    return dueDate.toLocaleDateString();
  };

  const handleReturnBook = async () => {
    if (!selectedBook) return;

    try {
      serReturning(true);
      toast.success("Book returned successfully!");
      setSelectedBook(null);
      fetchBorrowedBooks();
    } catch (err) {
      toast.error(err.message || "Failed to return book");
    } finally {
      serReturning(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <FaSpinner className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">
            Loading your borrowed books...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchBorrowedBooks}
          className="mt-4 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-white">
          My Borrowed Books
        </h1>
        <p className="text-sm text-white">
          Books currently issued to you
        </p>
      </div>

      {borrowedBooks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border">
          <FaBook className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Borrowed Books
          </h3>
          <p className="text-gray-500">
            You haven't borrowed any books yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {borrowedBooks.map((issue) => {
            const overdue = isOverdue(issue.issuedAt);

            return (
              <div
                key={issue._id}
                className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all hover:-translate-y-1"
              >
                {/* Image */}
                <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden rounded-t-xl">
                  {issue.book?.image ? (
                    <img
                      src={issue.book.image}
                      alt={issue.book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaBook className="w-16 h-16 text-gray-300" />
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-800 mb-1 line-clamp-2">
                    {issue.book?.title || "Unknown Title"}
                  </h3>

                  <p className="text-sm text-gray-600 mb-3">
                    <span className="font-medium">Author:</span>{" "}
                    {issue.book?.author || "Unknown"}
                  </p>

                  {/* Issued */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <FaCalendarAlt className="text-blue-500" />
                    <span>
                      Issued:{" "}
                      {new Date(issue.issuedAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Due */}
                  <div
                    className={`flex items-center gap-2 text-sm font-medium mb-3 ${
                      overdue ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {overdue && <FaExclamationTriangle />}
                    Due: {getDueDate(issue.issuedAt)}
                  </div>

                  {overdue && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-2 mb-4">
                      <p className="text-xs text-red-700 font-semibold">
                        This book is overdue. Please return it immediately.
                      </p>
                    </div>
                  )}

                  {/* Button */}
                  <button
                    onClick={() => setSelectedBook(issue)}
                    className={`w-full py-2.5 rounded-lg font-medium transition ${
                      overdue
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-teal-600 hover:bg-teal-700 text-white"
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

      {/* Confirm Modal */}
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
};

export default Issue;
