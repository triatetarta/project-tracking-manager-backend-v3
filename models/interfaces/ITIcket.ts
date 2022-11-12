import mongoose from "mongoose";

export interface ITicket extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  title: string;
  project: string;
  description: string;
  status: "to do" | "in progress" | "closed";
  numOfComments: number;
  createdAt: Date;
  updatedAt: Date;
}