import mongoose from "mongoose";
import { IComment } from "./interfaces/IComment";

const CommentSchema = new mongoose.Schema(
  {
    ticket: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Ticket",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: [true, "Please add your comment"],
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model<IComment>("Comment", CommentSchema);

export default Comment;
