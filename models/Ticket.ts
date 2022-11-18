import mongoose from "mongoose";
import Comment from "./Comment";
import { IComment } from "./interfaces/IComment";
import { ITicket } from "./interfaces/ITIcket";

const TicketSchema = new mongoose.Schema<ITicket>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
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
      type: String,
      required: false,
      enum: ["to do", "in progress", "closed"],
      default: "to do",
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
