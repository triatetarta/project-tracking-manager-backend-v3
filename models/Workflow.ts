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
    color: {
      type: String,
      required: false,
      enum: ["#2074e3", "#f6b73e", "#11a865"],
      default: "#2074e3",
    },
  },
  {
    timestamps: true,
  }
);

const Workflow = mongoose.model<IWorkflow>("Workflow", WorkflowSchema);

export default Workflow;
