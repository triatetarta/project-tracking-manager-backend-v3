import mongoose from "mongoose";

export interface IProject extends mongoose.Document {
  user: string;
  title: string;
  description: string;
  status: string;
  color: string;
}
