import mongoose from "mongoose";
import { ITicket } from "./interfaces/ITIcket";

const TicketSchema = new mongoose.Schema<ITicket>(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignee: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Please select the ticket's title"],
    },
    project: {
      type: String,
      required: [true, "Please select the project's title"],
    },
    description: {
      type: String,
      required: [true, "Please enter a description"],
    },
    status: {
      type: mongoose.Types.ObjectId,
      ref: "Workflow",
      required: true,
    },
    numOfComments: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

TicketSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "ticket",
  justOne: false,
});

TicketSchema.pre<ITicket>("remove", async function (next) {
  await this.model("Comment").deleteMany({ ticket: this._id });
});

const Ticket = mongoose.model("Ticket", TicketSchema);

export default Ticket;
