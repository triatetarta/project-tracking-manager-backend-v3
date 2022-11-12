import express from "express";
import {
  createTicket,
  getAllTickets,
  updateTicket,
  deleteTicket,
} from "../controllers/ticketController";

const router = express.Router();

router
  .route("/")
  .get(getAllTickets)
  .post(createTicket)
  .patch(updateTicket)
  .delete(deleteTicket);

export default router;
