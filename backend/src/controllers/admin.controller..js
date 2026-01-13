import { asyncHandler } from "../utils/asynchandler.js";
import { Book } from "../models/book.model.js";
import { cloudinaryUploader } from "../services/cloudinary.service.js";
import { User } from "../models/user.model.js";
import { Borrow } from "../models/borrow.model.js";

const registerBook = asyncHandler(async (req, res) => {
  const { title, author, publishedDate, publication, description } = req.body;

  // Validation
  if (
    !title?.trim() ||
    !author?.trim() ||
    !publishedDate?.trim() ||
    !publication?.trim() ||
    !description?.trim()
    ) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const alreadyExists = await Book.findOne({
    title: title.trim(),
    author: author.trim(),
    publication: publication.trim(),
  });

  if (alreadyExists) {
    return res.status(400).json({
      success: false,
      message: "Book already exists with same data",
    });
  }

  const bookImage = req.files?.image?.[0]?.path;
  if (!bookImage) {
    return res.status(400).json({
      success: false,
      message: "Book image is required",
    });
  }

  const responseOfCloudinary = await cloudinaryUploader(bookImage);

  const book = await Book.create({
    title: title.trim(),
    author: author.trim(),
    publishedDate: Number(publishedDate),
    publication: publication.trim(),
    description: description.trim(),
    image: responseOfCloudinary,
  });

  res.status(201).json({
    success: true,
    message: "Book entry created",
    book,
  });
});

const getMembers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password -refreshtoken");
  if (!users) {
    return res.status(401).json({
      message: "unable to retrive data from users",
    });
  }

  res.status(201).json({
    success: true,
    user: users,
  });
});

const getBooks = asyncHandler(async (req, res) => {
  const books = await Book.find();

  if (!books) {
    return res.status(400).json({
      success: false,
      message: "Books not found",
    });
  }

  return res.status(201).json({
    success: true,
    Books: books,
  });
});

const deleteProfile = asyncHandler(async (req, res) => {
  const { email } = req.params;
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  const user = await User.findOne({ studentemail: email });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  if (user.role === "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin profiles cannot be deleted",
    });
  }
  const deleteResult = await User.deleteOne({ studentemail: email });
  if (deleteResult.deletedCount === 0) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

const addMember = asyncHandler(async (req, res) => {
  const { studentemail, username, password } = req.body;

  if (!studentemail?.trim() || !username?.trim() || !password?.trim()) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }
  const alreadyExists = await User.findOne({
    studentemail: studentemail.trim(),
  });

  if (alreadyExists) {
    return res.status(400).json({
      success: false,
      message: "User already exists with same email",
    });
  }

  const user = await User.create({
    studentemail: studentemail.trim(),
    name: name.trim(),
    password: password.trim(),
    role: "student",
  });
});

const deleteBook = asyncHandler(async (req, res) => {
  const { bookId } = req.params;
  if (!bookId) {
    return res.status(400).json({
      success: false,
      message: "Book ID is required",
    });
  }
  const book = await Book.findById(bookId);
  if (!book) {
    return res.status(404).json({
      success: false,
      message: "Book not found",
    });
  }
  const deleteResult = await Book.deleteOne({ _id: bookId });
  if (deleteResult.deletedCount === 0) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete book",
    });
  }

  res.status(200).json({
    success: true,
    message: "Book deleted successfully",
  });
});

const editBook = asyncHandler(async (req, res) => {
  const { bookId } = req.params;
  const { title, author, publishedDate, publication, description } = req.body;
  if (
    !title?.trim() ||
    !author?.trim() ||
    !publishedDate?.trim() ||
    !publication?.trim() ||
    !description?.trim()
  ) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  if (!bookId) {
    return res.status(400).json({
      success: false,
      message: "Book ID is required",
    });
  }
  const book = await Book.findById(bookId);
  if (!book) {
    return res.status(404).json({
      success: false,
      message: "Book not found",
    });
  }

  book.title = title.trim();
  book.author = author.trim();
  book.publishedDate = Number(publishedDate);
  book.publication = publication.trim();
  book.description = description.trim();
  await book.save();

  res.status(200).json({
    success: true,
    message: "Book updated successfully",
    book,
  });
});

// Get all issued books
const getAllIssuedBooks = asyncHandler(async (req, res) => {
  try {
    const issuedBooks = await Borrow.find({ status: "ISSUED" })
      .populate('bookId')
      .populate('studentId', 'userName studentemail');

    const transformedBooks = issuedBooks.map(borrow => ({
      _id: borrow._id,
      book: borrow.bookId,
      student: borrow.studentId,
      issuedAt: borrow.borrowDate,
      returnDate: borrow.returnDate,
      status: borrow.status
    }));

    return res.status(200).json({
      success: true,
      books: transformedBooks
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch issued books",
      error: error.message
    });
  }
});

// Get all returned books
const getAllReturnedBooks = asyncHandler(async (req, res) => {
  try {
    const returnedBooks = await Borrow.find({ status: "RETURNED" })
      .populate('bookId')
      .populate('studentId', 'userName studentemail');

    const transformedBooks = returnedBooks.map(borrow => ({
      _id: borrow._id,
      book: borrow.bookId,
      user: borrow.studentId,
      issuedAt: borrow.borrowDate,
      returnDate: borrow.returnDate,
      returnedAt: borrow.returnedAt,
      status: borrow.status,
      updatedAt: borrow.updatedAt
    }));

    return res.status(200).json({
      success: true,
      books: transformedBooks
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch returned books",
      error: error.message
    });
  }
});

// Get all overdue books
const getOverdueBooks = asyncHandler(async (req, res) => {
  try {
    const now = new Date();
    const overdueBooks = await Borrow.find({ 
      status: "ISSUED",
      returnDate: { $lt: now }
    })
      .populate('bookId')
      .populate('studentId', 'userName studentemail');

    const transformedBooks = overdueBooks.map(borrow => ({
      _id: borrow._id,
      book: borrow.bookId,
      student: borrow.studentId,
      issuedAt: borrow.borrowDate,
      returnDate: borrow.returnDate,
      daysOverdue: Math.ceil((now - new Date(borrow.returnDate)) / (1000 * 60 * 60 * 24)),
      status: borrow.status
    }));

    return res.status(200).json({
      success: true,
      books: transformedBooks
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch overdue books",
      error: error.message
    });
  }
});

// Get recent activity
const getRecentActivity = asyncHandler(async (req, res) => {
  try {
    const recentBorrows = await Borrow.find()
      .populate('bookId', 'title')
      .populate('studentId', 'fullName')
      .sort({ createdAt: -1 })
      .limit(10);

    const activity = recentBorrows.map(borrow => ({
      type: borrow.status === 'ISSUED' ? 'Book Issued' : 'Book Returned',
      book: borrow.bookId?.title || 'Unknown Book',
      student: borrow.studentId?.fullName || 'Unknown Student',
      timestamp: borrow.status === 'ISSUED' ? borrow.borrowDate : borrow.returnedAt,
      status: borrow.status
    }));

    return res.status(200).json({
      success: true,
      activity
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch recent activity",
      error: error.message
    });
  }
});

// Get dashboard stats
const getDashboardStats = asyncHandler(async (req, res) => {
  try {
    const totalMembers = await User.countDocuments();
    const totalBooks = await Book.countDocuments();
    const issuedBooks = await Borrow.countDocuments({ status: "ISSUED" });
    const returnedBooks = await Borrow.countDocuments({ status: "RETURNED" });
    
    const now = new Date();
    const overdueBooks = await Borrow.countDocuments({ 
      status: "ISSUED",
      returnDate: { $lt: now }
    });

    return res.status(200).json({
      success: true,
      stats: {
        totalMembers,
        totalBooks,
        issuedBooks,
        returnedBooks,
        overdueBooks
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
      error: error.message
    });
  }
});

export {
  registerBook,
  getMembers,
  getBooks,
  deleteProfile,
  addMember,
  deleteBook,
  editBook,
  getAllIssuedBooks,
  getAllReturnedBooks,
  getOverdueBooks,
  getRecentActivity,
  getDashboardStats
};
