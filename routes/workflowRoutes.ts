import express from "express";
import {
  getAllWorkflowStatus,
  createWorkflowStatus,
  updateWorkflowStatus,
  deleteWorkflowStatus,
} from "../controllers/workflowController";
import { verifyJWT } from "../middleware/verifyJWT";

const router = express.Router();

router.use(verifyJWT);

router
  .route("/")
  .get(getAllWorkflowStatus)
  .post(createWorkflowStatus)
  .patch(updateWorkflowStatus)
  .delete(deleteWorkflowStatus);

export default router;
