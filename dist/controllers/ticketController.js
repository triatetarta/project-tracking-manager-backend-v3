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
exports.deleteTicket = exports.updateTicket = exports.getAllTickets = exports.createTicket = void 0;
const Ticket_1 = __importDefault(require("../models/Ticket"));
// @desc Get all tickets
// @route GET /tickets
// @access Private
const getAllTickets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tickets = yield Ticket_1.default.find().lean();
    if (!tickets.length) {
        res.status(400).json({ message: "No tickets found" });
    }
    res.json(tickets);
});
exports.getAllTickets = getAllTickets;
// @desc Create new ticket
// @route POST /tickets
// @access Private
const createTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, title, project, description, status } = req.body;
    if (!user || !title || !project || !description || !status) {
        res.status(400).json({ message: "All fields are required" });
    }
    const duplicate = yield Ticket_1.default.findOne({ title })
        .collation({ locale: "en", strength: 2 })
        .lean()
        .exec();
    if (duplicate) {
        res.status(409).json({ message: "Duplicate ticket title" });
    }
    const ticket = yield Ticket_1.default.create({
        user,
        title,
        project,
        description,
        status,
    });
    if (ticket) {
        res.status(201).json({ message: "Ticket successfully created" });
    }
    else {
        res.status(400).json({ message: "Invalid ticket data received" });
    }
});
exports.createTicket = createTicket;
// @desc Update a ticket
// @route PATCH /tickets
// @access Private
const updateTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, title, description, project, status } = req.body;
    if (!id || !title || !description || !project || !status) {
        res.status(400).json({ message: "All fields are required" });
    }
    const ticket = (yield Ticket_1.default.findById(id).exec());
    if (!ticket) {
        res.status(400).json({ message: "Ticket not found" });
    }
    const duplicate = yield Ticket_1.default.findOne({ title })
        .collation({ locale: "en", strength: 2 })
        .lean()
        .exec();
    if (duplicate && (duplicate === null || duplicate === void 0 ? void 0 : duplicate._id.toString()) !== id) {
        res.status(400).json({ message: "Duplicate ticket title" });
    }
    ticket.title = title;
    ticket.description = description;
    ticket.project = project;
    ticket.status = status;
    const updatedTicket = yield (ticket === null || ticket === void 0 ? void 0 : ticket.save());
    res.json(`'${updatedTicket === null || updatedTicket === void 0 ? void 0 : updatedTicket.title}' updated`);
});
exports.updateTicket = updateTicket;
// @desc Delete a ticket
// @route DELETE /tickets
// @access Private
const deleteTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    if (!id) {
        res.status(400).json({ message: "Ticket ID is required" });
    }
    const ticket = (yield Ticket_1.default.findById(id).exec());
    if (!ticket) {
        res.status(400).json({ message: "Ticket not found" });
    }
    const result = yield ticket.remove();
    const reply = `Ticket ${result.title} with ID ${result.id} deleted`;
    res.json(reply);
});
exports.deleteTicket = deleteTicket;
