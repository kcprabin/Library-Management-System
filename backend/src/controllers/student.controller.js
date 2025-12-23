import { asyncHandler } from "../utils/asynchandler";
import { Book } from "../models/book.model";

const getBooks = asyncHandler(async (req, res) => {
  try {
    const books = await Book.find();

    return res.status(200).json({
      length: books.length,
      book: books,
    });
  } catch (error) {
    console.log(error, "Unable to retrive books data ");
  }
});


export {getBooks}