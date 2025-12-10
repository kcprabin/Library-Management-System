import { asyncHandler } from "../utils/asynchandler.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt"

const registerUser = asyncHandler(async (req, res) => {
    

    
    //Handle user inputs from frontend as objects 
    const {studentemail , Password , role} = req.body
    console.log(studentemail)
    console.log(Password)
    
    

    // validations of correct format for empty
    if(Object.values({studentemail,Password}).some(data =>String(data)?.trim()=="" )){
        return res.status(400).json({
            message:"Empty feild"
        })
    }
        
    
    // email formatiing check
    const gmailFormat = /^.*@gmail\.com$/;
    if(!gmailFormat.test(studentemail)){
       return res.status(400).json({
        message:"not in format"
       })
    }


    //checking if already exists 
    const userExists = await User.findOne({
        studentemail})

        if(userExists){
        return res.status(409).json({
        messege:"lode23"
       })
     }
     // hashing password
     const hashedPass = await bcrypt.hash(Password,10);
 
     // saving data in database 
    const NewUser =  await User.create({
        studentemail1:studentemail  ,
        password1:Password  ,
        role:role
    })

    
    return res.status(201).json({
        messege:"User created",
        user : NewUser
      })

    

      
});

// login User
const loginUser= asyncHandler(
    async (req,res) =>{
        // check ussername and login info
        const {studentemail,Password,role} = req.body
        // check code working 
        // console.log(studentemail)
        // console.log(Password)

        // check empty or not 
       if(!studentemail|| !Password || !role ){
        return res.status(400).json({
            messege:"empty string"
        })
       }

       // check user and role 
       const existUser = await User.findOne({
        studentemail1:studentemail,
        role:role
       })

       if(!existUser){
        res.status(400).json({
            message:"Not user"
        })
       }

       // validate
       const Validate = await bcrypt.compare(Password,existUser.password1) 

       if(!Validate){
        res.status(400).json({
            messege:"Wrong password"
        })
       }

       return res.status(200).json({
        success:true,
        message:"Login sucessfull" ,
        user:{
            id: existUser._id,
            email:existUser.studentemail1,
            role: existUser.role
        }
       })

    })



export  {registerUser,loginUser};