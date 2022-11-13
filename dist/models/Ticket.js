"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const TicketSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Types.ObjectId,
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
        required: true,
        enum: ["to do", "in progress", "closed"],
        default: "to do",
    },
    numOfComments: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// TicketSchema.virtual("comments", {
//   ref: "Comment",
//   localField: "_id",
//   foreignField: "ticket",
//   justOne: false,
// });
// TicketSchema.pre("remove", async function (next) {
//   await this.model("Comment").deleteMany({ ticket: this._id });
// });
const Ticket = mongoose_1.default.model("Ticket", TicketSchema);
exports.default = Ticket;
