import express from "express";
import {
  insertProject,
  getProjects,
  editProject,
  deleteProject,
} from "../controllers/projectController.js";

const router = express.Router();
router.post("/insert", insertProject);
router.get("/getProjects", getProjects);
router.put("/editProject", editProject);
router.delete("/deleteProject/:id", deleteProject);

export default router;
