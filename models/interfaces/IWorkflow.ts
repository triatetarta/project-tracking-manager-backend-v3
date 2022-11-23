import mongoose from "mongoose";

export interface IWorkflow extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  title: string;
  description: string;
  color: "#2074e3" | "#f6b73e" | "#11a865";
}
