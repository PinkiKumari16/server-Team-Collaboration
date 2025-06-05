import mongoose from "mongoose";
import projectModel from "../models/projectModel.js";
import teams from "../models/teams.js";

export const insertProject = async (req, res) => {
  try {
    const { name, description, teamId } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Project name is required" });
    }
    const formattedTeamId = mongoose.Types.ObjectId.isValid(teamId)
      ? new mongoose.Types.ObjectId(teamId)
      : teamId;
    const newProject = await projectModel.create({
      name,
      description,
      teamId: formattedTeamId, // can be null if not provided
    });

    res.status(201).json({
      message: "Project created successfully",
      project: newProject,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProjects = async (req, res) => {
  try {
    const { teamId } = req.query;

    const projects = await projectModel
      .find({ teamId })
      .populate("teamId", "name");

    res.status(200).json({
      message: "Projects fetched successfully",
      projects,
    });
  } catch (error) {
    console.error("❌ Error fetching projects:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const editProject = async (req, res) => {
  try {
    const { id, name, description, teamId } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Project ID is required" });
    }
    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (teamId) {
      // Validate ObjectId format
      updateData.teamId = mongoose.Types.ObjectId.isValid(teamId)
        ? new mongoose.Types.ObjectId(teamId)
        : teamId;
    }

    const updatedProject = await projectModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("❌ Error editing project:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteProject = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "Project ID is required" });

  const deletedProject = await projectModel.findByIdAndDelete(id);
  if (!deletedProject) {
    return res.status(404).json({ message: "Project not found" });
  }
  res
    .status(200)
    .json({
      message: "Project deleted Successfully.",
      project: deletedProject,
    });
};
