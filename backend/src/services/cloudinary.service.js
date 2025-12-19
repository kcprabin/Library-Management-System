import { v2 as cloudinary } from "cloudinary";
import fs from "fs"
import dotenv from "dotenv";

dotenv.config({
    path:"./.env"
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const cloudinaryUploader = async (localpath)=>{
    if(!localpath) return null;
    try {
       const response =  await cloudinary.uploader.upload(localpath,{resource_type : "auto"})
       fs.unlinkSync(localpath)
      
       return response.url
        
    } catch (error) {
        fs.unlinkSync(localpath)
        console.log(error,"error in sending data in clodunary")
    }

}


export {cloudinaryUploader};
