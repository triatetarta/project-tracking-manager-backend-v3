import express from "express";
import {
  getAllWorkflows,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
} from "../controllers/workflowController";
import { verifyJWT } from "../middleware/verifyJWT";

const router = express.Router();

router.use(verifyJWT);

router
  .route("/")
  .get(getAllWorkflows)
  .post(createWorkflow)
  .patch(updateWorkflow)
  .delete(deleteWorkflow);

export default router;
