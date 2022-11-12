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
    status: {
      type: String,
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
