import express from "express";
import {
  createTicket,
  getAllTickets,
  updateTicket,
  deleteTicket,
} from "../controllers/ticketController";
import { verifyJWT } from "../middleware/verifyJWT";

const router = express.Router();

router.use(verifyJWT);

router
  .route("/")
  .get(getAllTickets)
  .post(createTicket)
  .patch(updateTicket)
  .delete(deleteTicket);

export default router;
