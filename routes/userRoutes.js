import express from "express";
import {
  getUsers,
  loginUser,
  registerUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getUsers", getUsers);

export default router;
