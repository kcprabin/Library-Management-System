import { User } from "../models/user.model";
import { asyncHandler } from "../utils/asynchandler";
import jwt from "jsonwebtoken"

export const loginInCheck = asyncHandler (
    async(req,res,next)=>{
   try {
      const tokens = req.cookies?.accesstokens || eq.header("Authorization")?.replace("Bearer", "");
        // taking token 
        if(!tokens){
         return res.status(400).json({
             success:false,
             message:"not able to get cookies"
         })
        }
 
        const decodedToken = jwt.verify(tokens,process.env.ACCESS_TOKEN)
 
        if(!decodedToken){
         return res.status(400).json({
             success:false,
             message:"unable to verify tokens"
         })
        }

        const user = await User.findById(decodedToken._id).select("-password -refreshtoken")
        if(!user){
             return res.status(400).json({
             success:false,
             message:"unable to verify tokens"
         })}

         req.body = user

         next()


        
 
        return req.user
   } catch (error) {
    console.log(error,"unable to take tokens ")
    
   }



    
    }
)