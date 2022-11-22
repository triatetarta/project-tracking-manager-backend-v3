import { Request, Response } from "express";
import User from "../models/User";
import Ticket from "../models/Ticket";
import bcrypt from "bcrypt";
import { IUser } from "../models/interfaces/IUser";
import cloudinary from "../config/cloudinary";

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.find().select("-password").lean();

  res.json(users);
};

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = async (req: Request, res: Response) => {
  const { email, name, password } = req.body;

  if (!name || !password) {
    res.status(400).json({ message: "All fields are required" });
  }

  const emailAlreadyExists = await User.findOne({ email }).lean().exec();

  if (emailAlreadyExists) {
    res.status(409).json({ message: "Email already exists" });
  }

  const isFirstAccount = (await User.countDocuments({})) === 0;
  const roles = isFirstAccount ? ["Admin"] : ["Employee"];

  const hashedPwd = await bcrypt.hash(password, 10);

  const userObject = { name, email, password: hashedPwd, roles };

  const user = await User.create(userObject);

  if (user) {
    res.status(201).json({ message: `New user ${name} created` });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
};

// @desc Update a user's profile pic
// @route PATCH /users/uploadImage
// @access Private
const uploadImage = async (req: Request, res: Response) => {
  const { id, image } = req.body;

  if (!image) {
    res.status(400).json({ message: "Please select an image" });
  }

  const user = (await User.findOne({ _id: id }).exec()) as IUser;

  if (!user) {
    res.status(400).json({ message: "User not found" });
  }

  let updatedUser;

  if (user.image !== "") {
    await cloudinary.uploader.destroy(user.image, (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log("Image has been removed from cloudinary");
    });

    const uploadedImage = await cloudinary.uploader.upload(
      image,
      {
        upload_preset: "unsigned_upload",
        allowed_formats: ["png", "jpg", "jpeg", "svg", "ico", "jfif", "webp"],
      },
      (err, result) => {
        if (err) {
          res
            .status(400)
            .json({ message: "Something went wrong with uploading the image" });
        }

        console.log("image uploaded to cloudinary");
      }
    );

    const updateUser = await User.findOneAndUpdate(
      {
        _id: id,
      },
      { image: uploadedImage.public_id },
      { new: true, runValidators: true }
    );

    updatedUser = updateUser;
  } else {
    const uploadedImage = await cloudinary.uploader.upload(
      image,
      {
        upload_preset: "unsigned_upload",
        allowed_formats: ["png", "jpg", "jpeg", "svg", "ico", "jfif", "webp"],
      },
      (err, result) => {
        if (err) {
          res
            .status(400)
            .json({ message: "Something went wrong with uploading the image" });
        }

        console.log("image uploaded to cloudinary");
      }
    );

    const updateUser = await User.findOneAndUpdate(
      { _id: id },
      { image: uploadedImage.public_id },
      { new: true, runValidators: true }
    );

    updatedUser = updateUser;
  }

  res.status(200).json({ message: "Image successfully uploaded" });
};

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = async (req: Request, res: Response) => {
  const { id, jobTitle, team, department, location, password, roles } =
    req.body;

  if (
    !id ||
    !jobTitle ||
    !team ||
    !department ||
    !location ||
    !Array.isArray(roles) ||
    !roles.length
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

  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await user.save();

  res.json({ message: `${updatedUser.name} updated` });
};

// @desc Delete a user
// @route Delete /users
// @access Private
const deleteUser = async (req: Request, res: Response) => {
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
};

export { getAllUsers, createNewUser, updateUser, deleteUser, uploadImage };
