import { Request, Response } from "express";
import Ticket from "../models/Ticket";
import { ITicket } from "../models/interfaces/ITIcket";

// @desc Get all tickets
// @route GET /tickets
// @access Private
const getAllTickets = async (req: Request, res: Response) => {
  const tickets = await Ticket.find().lean();

  res.json(tickets);
};

// @desc Create new ticket
// @route POST /tickets
// @access Private
const createTicket = async (req: Request, res: Response) => {
  const { user, title, project, description, assignee, status } = req.body;

  if (!user || !title || !project || !description || !assignee || !status) {
    res.status(400).json({ message: "All fields are required" });
  }

  const duplicate = await Ticket.findOne({ title })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate) {
    res.status(409).json({ message: "Duplicate ticket title" });
  }

  const ticket = await Ticket.create({
    user,
    title,
    project,
    description,
    assignee,
    status,
  });

  if (ticket) {
    res.status(201).json({ message: "Ticket successfully created" });
  } else {
    res.status(400).json({ message: "Invalid ticket data received" });
  }
};

// @desc Update a ticket
// @route PATCH /tickets
// @access Private
const updateTicket = async (req: Request, res: Response) => {
  const { id, title, description, project, status, assignee } = req.body;

  if (!id) {
    res.status(400).json({ message: "Ticket ID is required" });
  }

  const ticket = (await Ticket.findById(id).exec()) as ITicket;

  if (!ticket) {
    res.status(400).json({ message: "Ticket not found" });
  }

  const duplicate = await Ticket.findOne({ title })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate && duplicate?._id.toString() !== id) {
    res.status(400).json({ message: "Duplicate ticket title" });
  }

  ticket.title = title;
  ticket.description = description;
  ticket.project = project;
  ticket.status = status;
  ticket.assignee = assignee;

  const updatedTicket = await ticket?.save();

  res.json(`'${updatedTicket?.title}' updated`);
};

// @desc Delete a ticket
// @route DELETE /tickets
// @access Private
const deleteTicket = async (req: Request, res: Response) => {
  const { id } = req.body;

  if (!id) {
    res.status(400).json({ message: "Ticket ID is required" });
  }

  const ticket = (await Ticket.findOne({ _id: id })) as ITicket;

  if (!ticket) {
    res.status(400).json({ message: "Ticket not found" });
  }

  await ticket.remove();

  res.status(200).json({ message: "Ticket has been removed" });
};

export { createTicket, getAllTickets, updateTicket, deleteTicket };
