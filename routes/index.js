import express from "express";
import userRoutes from "./userRoutes.js";
import projectRoutes from "./projectRoutes.js";
import taskRoutes from "./taskRoutes.js";
import chatRoutes from "./chatRoutes.js";

const router = express.Router();

// Test route
router.get("/test", (req, res) => {
  console.log("✅ Test route hit");
  res.json({ message: "API working!" });
});

router.use("/users", userRoutes);
router.use("/projects", projectRoutes);
router.use("/task", taskRoutes);
router.use("/messages", chatRoutes);

export default router;
