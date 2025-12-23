import { asyncHandler } from "../utils/asynchandler.js";
import { Book } from "../models/book.model.js";
import { cloudinaryUploader } from "../services/cloudinary.service.js";

const registerBook = asyncHandler(async (req, res) => {
  const { Title, Author, PublishedDate, Publication, descriptions } = req.body;

  // Validation
  if (!Title?.trim() || !Author?.trim() || !PublishedDate?.trim() || !Publication?.trim() || !descriptions?.trim()) {
    return res.status(400).json({
      success: false,
      message: "All fields are required"
    });
  }


  const alreadyExists = await Book.findOne({
    title: Title.trim(),
    author: Author.trim(),
    publication: Publication.trim()
  });

  if (alreadyExists) {
    return res.status(400).json({
      success: false,
      message: "Book already exists with same data"
    });
  }


  const bookImage = req.files?.image?.[0]?.path;
  if (!bookImage) {
    return res.status(400).json({
      success: false,
      message: "Book image is required"
    });
  }

  const responseOfCloudinary = await cloudinaryUploader(bookImage);


  const book = await Book.create({
    title: Title.trim(),
    author: Author.trim(),
    publishedDate: PublishedDate,
    publication: Publication.trim(),
    description: descriptions.trim(),
    image: responseOfCloudinary
  });


  res.status(201).json({
    success: true,
    message: "Book entry created",
    book
  });
});


export { registerBook };
