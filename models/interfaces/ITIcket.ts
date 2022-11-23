import mongoose from "mongoose";

export interface ITicket extends mongoose.Document {
  [x: string]: any;
  _id?: mongoose.Types.ObjectId | string;
  user: mongoose.Types.ObjectId;
  assignee?: mongoose.Types.ObjectId;
  title: string;
  project: string;
  description: string;
  status: mongoose.Types.ObjectId;
  numOfComments: number;
  createdAt: Date;
  updatedAt: Date;
}
