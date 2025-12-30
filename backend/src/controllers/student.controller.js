import { asyncHandler } from "../utils/asynchandler.js";
import { Book } from "../models/book.model.js";
import { BooksIssue } from "../models/bookissue.model.js";

const getBooks = asyncHandler(async (req, res) => {
  try {
    const books = await Book.find();

    return res.status(200).json({
      book: books,
    });
  } catch (error) {
    console.log(error, "Unable to retrive books data ");
  }
});

const bookBorrow = asyncHandler(async (req, res) => {
  const student = req.user;
  console.log(student);

  const { bookid } = req.body;
  if (!bookid || !student) {
    return res.status(401).json({
      success: false,
      message: "empty feild",
    });
  }

  const existingIssue = await BooksIssue.findOne({
    book: bookid,
    status: "ISSUED",
  });

  if (existingIssue) {
    return res.status(400).json({
      success: false,
      message: "Book already issued",
    });
  }

  if (BooksIssue.status === "ISSUED") {
    return res.status(400).json({
      message: "already issued",
    });
  }
  
   const bookThatIsTaken = await BooksIssue.create({
  book: bookid,
  user: student._id,
  issuedAt: new Date(),
  returnedAt: null,
  status: "ISSUED",
});



  return res.json({
    message: "Book issued successfully",
    data:bookThatIsTaken

  });
});

const bookTaken  = asyncHandler(
  async(req,res)=>{
    const booktaken = await BooksIssue.find()

    return res.status(201).json({
      books:booktaken
    })
  }
)
export { getBooks, bookBorrow ,bookTaken};
