import mongoose from "mongoose";
import { IProject } from "./interfaces/IProject";

const ProjectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: [true, "Please enter project's title"],
    },
    description: {
      type: String,
      required: [true, "Please enter a description"],
    },
    color: {
      type: String,
      required: false,
      default: "#8c4bff",
    },
    status: {
      type: String,
      required: false,
      enum: ["open", "closed"],
      default: "open",
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
