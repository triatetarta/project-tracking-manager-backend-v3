import express from "express";
import {
  createNewUser,
  deleteUser,
  getAllUsers,
  updateUser,
  uploadImage,
} from "../controllers/userController";

const router = express.Router();

router
  .route("/")
  .get(getAllUsers)
  .post(createNewUser)
  .patch(updateUser)
  .delete(deleteUser);

router.route("/uploadImage").patch(uploadImage);

export default router;
