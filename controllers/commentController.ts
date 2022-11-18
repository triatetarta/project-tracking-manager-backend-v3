import { Request, Response } from "express";
import Ticket from "../models/Ticket";
import Comment from "../models/Comment";
import { IComment } from "../models/interfaces/IComment";

// @desc Create new comment
// @route POST /comments
// @access Private
const createComment = async (req: Request, res: Response) => {
  const { user: userId, ticket: ticketId, text } = req.body;

  if (!userId || !ticketId || !text) {
    res.status(400).json({ message: "All fields are required" });
  }

  const isValidTicket = await Ticket.findOne({ _id: ticketId });

  if (!isValidTicket) {
    res.status(409).json({ message: "No ticket found" });
  }

  const duplicate = await Comment.findOne({ text })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate) {
    res.status(409).json({ message: "Duplicate comment" });
  }

  const comment = await Comment.create(req.body);

  if (comment) {
    res.status(201).json({ message: "Comment successfully created" });
  } else {
    res.status(400).json({ message: "Invalid comment data received" });
  }
};

// @desc    Get single ticket comments
// @route   GET /comments
// @access  Private
const getSingleTicketComments = async (req: Request, res: Response) => {
  const { id: ticketId } = req.params;

  const comments = await Comment.find({ ticket: ticketId });

  if (!comments.length) {
    res.status(400).json({ message: "No comments found" });
  }

  res.json(comments);
};

// @desc Update a comment
// @route PATCH /comments
// @access Private
const updateComment = async (req: Request, res: Response) => {
  const { id, text } = req.body;

  if (!id) {
    res.status(400).json({ message: "Comment ID is required" });
  }

  const comment = (await Comment.findById(id).exec()) as IComment;

  if (!comment) {
    res.status(400).json({ message: "Comment not found" });
  }

  comment.text = text;

  await comment?.save();

  res.json(`Comment has been updated`);
};

// @desc Delete a comment
// @route DELETE /comments
// @access Private
const deleteComment = async (req: Request, res: Response) => {
  const { id: commentId } = req.body;

  if (!commentId) {
    res.status(400).json({ message: "Comment ID is required" });
  }

  const comment = (await Comment.findById(commentId).exec()) as IComment;

  if (!comment) {
    res.status(400).json({ message: "Comment not found" });
  }

  await comment.remove();

  res.json({ message: "Comment has been deleted" });
};

export { createComment, getSingleTicketComments, updateComment, deleteComment };
