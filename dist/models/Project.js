"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ProjectSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
});
const Project = mongoose_1.default.model("Project", ProjectSchema);
exports.default = Project;
