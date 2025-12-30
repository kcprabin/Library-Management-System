import mongoose, {Schema} from "mongoose";

// book scheema 
const bookSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    author:{
        type:String,
        required:true,
    },
    publishedDate:{
        type:Number,
        required:true,
    },
    image:{
        type:String,
        required:true
    },
    publication:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true
    }
},{timestamps:true})


export const Book = mongoose.model("book",bookSchema);