import { Request } from "express";
import mongoose from "mongoose";

export interface IUserRequest extends Request {
  user?: any;
}

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  roles: string[];
  active: boolean;
  jobTitle: string;
  team: string;
  department: string;
  location: string;
  image: string;
  tutorialed: boolean;
}
