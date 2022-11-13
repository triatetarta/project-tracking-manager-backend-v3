import express from "express";
import {
  createProject,
  deleteProject,
  getAllProjects,
  updateProject,
} from "../controllers/projectController";
import { verifyJWT } from "../middleware/verifyJWT";

const router = express.Router();

router.use(verifyJWT);

router
  .route("/")
  .get(getAllProjects)
  .post(createProject)
  .patch(updateProject)
  .delete(deleteProject);

export default router;
