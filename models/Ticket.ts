import mongoose from "mongoose";
import { ITicket } from "./interfaces/ITIcket";

const TicketSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
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
      required: true,
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

// TicketSchema.virtual("comments", {
//   ref: "Comment",
//   localField: "_id",
//   foreignField: "ticket",
//   justOne: false,
// });

// TicketSchema.pre("remove", async function (next) {
//   await this.model("Comment").deleteMany({ ticket: this._id });
// });

const Ticket = mongoose.model<ITicket>("Ticket", TicketSchema);

export default Ticket;
