import mongoose from "mongoose";
import { IWorkflow } from "./interfaces/IWorkflow";

const WorkflowSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: [true, "Please enter workflow's title"],
    },
    description: {
      type: String,
      required: [true, "Please enter a description"],
    },
    category: {
      type: String,
      required: false,
      enum: ["to do", "in progress", "closed"],
      default: "to do",
    },
  },
  {
    timestamps: true,
  }
);

const Workflow = mongoose.model<IWorkflow>("Workflow", WorkflowSchema);

export default Workflow;
