import mongoose, { Schema } from "mongoose";

const bookissueschema = new Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "book",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    issuedAt: Date,
    returnedAt: Date,
    status: {
      type: String,
      enum: ["ISSUED", "RETURNED"],
    },
  },
  { timestamps: true }
);

export const BooksIssue = mongoose.model("Issue", bookissueschema);
