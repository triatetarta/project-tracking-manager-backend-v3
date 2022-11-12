import express from "express";
import {
  createProject,
  deleteProject,
  getAllProjects,
  updateProject,
} from "../controllers/projectController";

const router = express.Router();

router
  .route("/")
  .get(getAllProjects)
  .post(createProject)
  .patch(updateProject)
  .delete(deleteProject);

export default router;
