import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

//data model for user Students
const userSchema = new Schema({
    studentemail1:{
        type:String,
        requrired:true,
        trim:true,
        index:true,  
    },
    password1:{
        type:String,
        requrired:true,
        trim:true
    },
    role:{
        type:String,
        required:true
    },
    refreshtoken:{
        type:String
    }
    
  

},{timestamps:true})


// password incyption logic dont use next 
userSchema.pre("save",
   async function(){
    if(!this.isModified("password1")) return ;
    this.password1 = await bcrypt.hash(this.password1,10)
   }
)

// generate accessToken
userSchema.methods.generateAccessToken = function(){
    jwt.sign({
        _id : this._id,
        studentemail1:this.studentemail1,
        role:this.role
    },process.env.ACCESS_TOKEN_SECRECT,{
expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    })
}

// refresh token secrect
userSchema.methods.generateRefreshToken = function(){
    jwt.sign({
        _id: this._id
    },process.env.REFRESH_TOKEN_SECRECT,{
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    })
}



// check password code 
userSchema.methods.IsPasswordCorrect = async function (password) {
    return  await bcrypt.compare(password,this.password)
}



export const User = mongoose.model("user",userSchema)