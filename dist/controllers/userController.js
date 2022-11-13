"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createNewUser = exports.getAllUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
const Ticket_1 = __importDefault(require("../models/Ticket"));
const bcrypt_1 = __importDefault(require("bcrypt"));
// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield User_1.default.find().select("-password").lean();
    if (!(users === null || users === void 0 ? void 0 : users.length)) {
        res.status(400).json({ message: "No users found" });
    }
    res.json(users);
});
exports.getAllUsers = getAllUsers;
// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, password, roles } = req.body;
    if (!name || !password || !Array.isArray(roles) || !roles.length) {
        res.status(400).json({ message: "All fields are required" });
    }
    const emailAlreadyExists = yield User_1.default.findOne({ email }).lean().exec();
    if (emailAlreadyExists) {
        res.status(409).json({ message: "Email already exists" });
    }
    const hashedPwd = yield bcrypt_1.default.hash(password, 10);
    const userObject = { name, email, password: hashedPwd, roles };
    const user = yield User_1.default.create(userObject);
    if (user) {
        res.status(201).json({ message: `New user ${name} created` });
    }
    else {
        res.status(400).json({ message: "Invalid user data received" });
    }
});
exports.createNewUser = createNewUser;
// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, jobTitle, team, department, location, password, roles, active } = req.body;
    if (!id ||
        !jobTitle ||
        !team ||
        !department ||
        !location ||
        !Array.isArray(roles) ||
        !roles.length ||
        typeof active !== "boolean") {
        res
            .status(400)
            .json({ message: "All fields except password are required" });
    }
    const user = (yield User_1.default.findById(id).exec());
    if (!user) {
        res.status(400).json({ message: "User not found" });
    }
    user.jobTitle = jobTitle;
    user.team = team;
    user.department = department;
    user.location = location;
    user.roles = roles;
    user.active = active;
    if (password) {
        user.password = yield bcrypt_1.default.hash(password, 10);
    }
    const updatedUser = yield user.save();
    res.json({ message: `${updatedUser.name} updated` });
});
exports.updateUser = updateUser;
// @desc Delete a user
// @route Delete /users
// @access Private
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    if (!id) {
        res.status(400).json({ message: "User ID is required" });
    }
    const ticket = yield Ticket_1.default.findOne({ user: id }).lean().exec();
    if (ticket) {
        res.status(400).json({ message: "User has asssigned tickets" });
    }
    const user = (yield User_1.default.findById(id).exec());
    if (!user) {
        res.status(400).json({ message: "User not found" });
    }
    const result = yield user.deleteOne();
    const reply = `User ${result.name} with ID ${result._id} deleted`;
    res.json(reply);
});
exports.deleteUser = deleteUser;
