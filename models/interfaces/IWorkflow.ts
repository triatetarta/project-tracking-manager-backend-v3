import mongoose from "mongoose";

export interface IWorkflow extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: "to do" | "in progress" | "closed";
}
