import mongoose from "mongoose";
import { IUser } from "./interfaces/IUser";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please provide email"],
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 6,
  },
  roles: [
    {
      type: String,
      default: "Employee",
    },
  ],
  active: {
    type: Boolean,
    default: true,
  },
  jobTitle: {
    type: String,
    required: false,
    default: "",
  },
  team: {
    type: String,
    required: false,
    default: "",
  },
  department: {
    type: String,
    required: false,
    default: "",
  },
  location: {
    type: String,
    required: false,
    default: "",
  },
  image: {
    type: String,
    required: false,
    default: "",
  },
});

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
