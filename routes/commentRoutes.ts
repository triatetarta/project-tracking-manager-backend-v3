import express from "express";
import {
  createComment,
  updateComment,
  getSingleTicketComments,
  deleteComment,
} from "../controllers/commentController";
import { verifyJWT } from "../middleware/verifyJWT";

const router = express.Router();

router.use(verifyJWT);

router
  .route("/")
  .post(createComment)
  .patch(updateComment)
  .delete(deleteComment);

router.route("/:id").get(getSingleTicketComments);

export default router;
