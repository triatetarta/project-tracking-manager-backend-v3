import express from "express";
import {
  createNewUser,
  deleteUser,
  getAllUsers,
  updateUser,
  uploadImage,
} from "../controllers/userController";
import { verifyJWT } from "../middleware/verifyJWT";

const router = express.Router();

router
  .route("/")
  .get(verifyJWT, getAllUsers)
  .post(createNewUser)
  .patch(verifyJWT, updateUser)
  .delete(verifyJWT, deleteUser);

router.route("/uploadImage").patch(uploadImage);

export default router;
