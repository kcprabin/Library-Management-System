import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"

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
    }
    
  

},{timestamps:true})


// password incyption logic dont use next 
userSchema.pre("save",
   async function(){
    if(!this.isModified("password1")) return ;
    this.password1 = await bcrypt.hash(this.password1,10)
   }
)



// check password code 
userSchema.methods.IsPasswordCorrect = async function (password) {
    return  await bcrypt.compare(password,this.password)
}

// refresh token baki
// access token baki 

export const User = mongoose.model("user",userSchema)