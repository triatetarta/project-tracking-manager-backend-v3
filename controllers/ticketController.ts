import { Request, Response } from "express";
import Ticket from "../models/Ticket";
import { ITicket } from "../models/interfaces/ITIcket";

// @desc Get all tickets
// @route GET /tickets
// @access Private
const getAllTickets = async (req: Request, res: Response) => {
  const tickets = await Ticket.find().lean();

  if (!tickets.length) {
    res.status(400).json({ message: "No tickets found" });
  }

  res.json(tickets);
};

// @desc Create new ticket
// @route POST /tickets
// @access Private
const createTicket = async (req: Request, res: Response) => {
  const { user, title, project, description } = req.body;

  if (!user || !title || !project || !description) {
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
  const { id, title, description, project, status } = req.body;

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

  const ticket = (await Ticket.findById(id).exec()) as ITicket;

  if (!ticket) {
    res.status(400).json({ message: "Ticket not found" });
  }

  const result = await ticket.remove();

  const reply = `Ticket ${result.title} with ID ${result.id} deleted`;

  res.json(reply);
};

export { createTicket, getAllTickets, updateTicket, deleteTicket };
