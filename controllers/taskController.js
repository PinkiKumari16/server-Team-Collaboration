import mongoose from "mongoose";
import teams from "../models/teams.js";
import taskModel from "../models/taskModel.js";

export const insertTask = async (req, res) => {
  try {
    const newTask = new taskModel(req.body);
    const saved = await newTask.save();

    const populated = await taskModel
      .findById(saved._id)
      .populate("projectId", "name")
      .populate("assignedTo", "name");

    const formattedTask = {
      ...populated._doc,
      assignedTo: populated.assignedTo
        ? { _id: populated.assignedTo._id, name: populated.assignedTo.name }
        : { _id: null, name: "Unassigned" },
      projectId: populated.projectId
        ? { _id: populated.projectId._id, name: populated.projectId.name }
        : { _id: null, name: "Unknown" },
    };

    res
      .status(201)
      .json({ message: "Task Added Successfully.", task: formattedTask });
  } catch (err) {
    console.error("❌ Error inserting task:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTask = async (req, res) => {
  const { projectId } = req.query;

  if (!projectId) {
    return res
      .status(400)
      .json({ message: "Project ID is required as query parameter" });
  }

  try {
    const tasks = await taskModel
      .find({ projectId }) // fetch tasks for the given projectId
      .populate("projectId", "name")
      .populate("assignedTo", "name");

    const formattedTasks = tasks.map((task) => ({
      ...task._doc,
      assignedTo: task.assignedTo
        ? { _id: task.assignedTo._id, name: task.assignedTo.name }
        : { _id: null, name: "Unassigned" },
      projectId: task.projectId
        ? { _id: task.projectId._id, name: task.projectId.name }
        : { _id: null, name: "Unknown" },
    }));

    res
      .status(200)
      .json({ message: "Tasks fetched successfully", tasks: formattedTasks });
  } catch (error) {
    console.error("❌ Error fetching tasks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const editTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTask = await taskModel
      .findByIdAndUpdate(id, req.body, {
        new: true,
      })
      .populate("projectId", "name")
      .populate("assignedTo", "name");

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    const formattedTask = {
      ...updatedTask._doc,
      assignedTo: updatedTask.assignedTo
        ? { _id: updatedTask.assignedTo._id, name: updatedTask.assignedTo.name }
        : { _id: null, name: "Unassigned" },
      projectId: updatedTask.projectId
        ? { _id: updatedTask.projectId._id, name: updatedTask.projectId.name }
        : { _id: null, name: "Unknown" },
    };

    res
      .status(200)
      .json({
        message: "Task updated Successfully.",
        updatedTask: formattedTask,
      });
  } catch (error) {
    console.error("❌ Error updating task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTaskStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  try {
    const updated = await taskModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .populate("projectId", "name")
      .populate("assignedTo", "name");

    if (!updated) {
      return res.status(404).json({ message: "Task not found" });
    }

    const formattedTask = {
      ...updated._doc,
      assignedTo: updated.assignedTo
        ? { _id: updated.assignedTo._id, name: updated.assignedTo.name }
        : { _id: null, name: "Unassigned" },
      projectId: updated.projectId
        ? { _id: updated.projectId._id, name: updated.projectId.name }
        : { _id: null, name: "Unknown" },
    };

    res
      .status(200)
      .json({
        message: "Task status updated Successfully.",
        task: formattedTask,
      });
  } catch (err) {
    console.error("❌ Error updating task status:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "Task ID is required" });

  const deletedTask = await taskModel.findByIdAndDelete(id);
  if (!deletedTask) {
    return res.status(404).json({ message: "Task not found" });
  }
  res
    .status(200)
    .json({ message: "Task deleted Successfully.", task: deletedTask });
};
