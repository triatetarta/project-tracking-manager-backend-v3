import { Request, Response } from "express";
import User from "../models/User";
import Ticket from "../models/Ticket";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import { IUser } from "../models/interfaces/IUser";

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find().select("-password").lean();

  if (!users?.length) {
    res.status(400).json({ message: "No users found" });
  }

  res.json(users);
});

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, name, password, roles } = req.body;

  if (!name || !password || !Array.isArray(roles) || !roles.length) {
    res.status(400).json({ message: "All fields are required" });
  }

  const emailAlreadyExists = await User.findOne({ email }).lean().exec();

  if (emailAlreadyExists) {
    res.status(409).json({ message: "Email already exists" });
  }

  const hashedPwd = await bcrypt.hash(password, 10);

  const userObject = { name, email, password: hashedPwd, roles };

  const user = await User.create(userObject);

  if (user) {
    res.status(201).json({ message: `New user ${name} created` });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
});

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { id, jobTitle, team, department, location, password, roles, active } =
    req.body;

  if (
    !id ||
    !jobTitle ||
    !team ||
    !department ||
    !location ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== "boolean"
  ) {
    res
      .status(400)
      .json({ message: "All fields except password are required" });
  }

  const user = (await User.findById(id).exec()) as IUser;

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
    user.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await user.save();

  res.json({ message: `${updatedUser.name} updated` });
});

// @desc Delete a user
// @route Delete /users
// @access Private
const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.body;

  if (!id) {
    res.status(400).json({ message: "User ID is required" });
  }

  const ticket = await Ticket.findOne({ user: id }).lean().exec();

  if (ticket) {
    res.status(400).json({ message: "User has asssigned tickets" });
  }

  const user = (await User.findById(id).exec()) as IUser;

  if (!user) {
    res.status(400).json({ message: "User not found" });
  }

  const result = await user.deleteOne();

  const reply = `User ${result.name} with ID ${result._id} deleted`;

  res.json(reply);
});

export { getAllUsers, createNewUser, updateUser, deleteUser };
