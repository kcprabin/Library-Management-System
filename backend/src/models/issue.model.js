import mongoose, { Schema } from "mongoose";


const issueschema = new Schema({
     problem:{
        type: String,
        required:true
     }
},{timestamps:true})


export const Issue = mongoose.model('issue',issueschema)