"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
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
const User = mongoose_1.default.model("User", UserSchema);
exports.default = User;
