import { asyncHandler } from "../utils/asynchandler.js";
import { Book } from "../models/book.model.js";
import { cloudinaryUploader } from "../services/cloudinary.service.js";
import { User } from "../models/user.model.js";
import { Issue} from "../models/issue.model.js";


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

const getMembers = asyncHandler(
  async(req,res)=>{

    const users = await User.find().select("-password -refreshtoken");
    console.log(users)


    if(!users){
      return res.status(401).json({
        message:"unable to retrive data from users"
      })
    }


    res.status(201).json({
      success:true,
      user:users
      
    })

  }
)

const getBooks = asyncHandler(
  async(req,res)=>{
    const books = await Book.find()

    if(!books){
      return res.status(400).json({
        success:false,
        message:"Books not found"
      })
    }

    return res.status(201).json({
      success:true,
      Books:books
    })



  }
)

const issues = asyncHandler(
  async(req,res)=>{
    adminid = req.user
    console.log(adminid)

    const { problem } = req.body

    if(!problem ){
      return res.status(400).json({
        success:false,
        message:"empty string"
      })
    }
    const issue =  await Issue.create({
      problem:problem
    })

    if(!issue){
       return res.status(400).json({
        success:false,
        message:"unable to create entry error"
      })
    }

    return res.status(201).json({
      success:true,
      issue:issue
    })

  }
)

const issueForAdmin = asyncHandler(
  async(req, res)=>{
    const problem = await Issue.find()

    if(!problem){
      return res.status(201).json({
        message:"no problem"
      })
    }

    return res.status(201).json({
      issue:problem
    })


  }
)





export { registerBook,getMembers, getBooks, issues, issueForAdmin };
