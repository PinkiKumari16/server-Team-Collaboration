import express from "express";
import {
  deleteTask,
  editTask,
  getTask,
  insertTask,
  updateTaskStatus,
} from "../controllers/taskController.js";

const router = express.Router();
router.post("/insert", insertTask);
router.get("/getTasks", getTask);
router.put("/editTask/:id", editTask);
router.put("/updateStatus/:id", updateTaskStatus);
router.delete("/deleteTask/:id", deleteTask);

export default router;
