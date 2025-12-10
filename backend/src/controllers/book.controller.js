import { asyncHandler } from "../utils/asynchandler.js";
import { book } from "../models/book.model.js";
// book entry code 

// error in thiss code in some json part needs to be corrected 




const registerBook = asyncHandler(
  // book entry
   async (req, res) => {
    const { Title, Author, PublishedDate, Publication } = req.body;
    console.log(`Title: ${Title}`);

    // check conditiions
    if (
      [Title, Author, PublishedDate, Publication].some(
        (feilds) => feilds?.trim() == ""
      )
    ) return  res.status(400).json({
      message:"Feild empty"
    })

    //checking if entry exists
    const alreadyExists = await book.findOne({
      Title:Title,
      Author:Author,
      PubishedDate:PublishedDate,
      Publication:Publication,
    })

    if(alreadyExists){
      res.status(400).json({
        message:"already exists"
      })
    }


    // storing data
     const booksData = await book.create({
        Title, Author, PubishedDate:PublishedDate,  Publication
    })


    // response send
    res.status(200).json(
        {
          success:true,
          message:"books entry created ",
          books : {
            Title :booksData.Title,
            PublishedDate: booksData.PubishedDate,
            Publication:booksData.Publication
           }

        }
    )
        
   
  }
);

export {registerBook}
