import mongoose from "mongoose";

export interface IComment extends mongoose.Document {
  _id?: mongoose.Types.ObjectId;
  ticket: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  text: string;
}
