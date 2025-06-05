import mongoose from "mongoose";
import userModel from "../models/userModel.js";

export const registerUser = async (req, res) => {
  try {
    const { firebaseUid, name, email, role, teamId } = req.body;

    if (!firebaseUid || !name || !email) {
      return res
        .status(400)
        .json({ message: "firebaseUid, name, and email are required" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const formattedTeamId = mongoose.Types.ObjectId.isValid(teamId)
      ? new mongoose.Types.ObjectId(teamId)
      : teamId;
    const newUser = await userModel.create({
      firebaseUid,
      name,
      email,
      role,
      teamId: formattedTeamId,
    });

    res
      .status(201)
      .json({ message: "User SingUp Successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", details: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { firebaseUid, email } = req.body;

  // Validate input
  if (!firebaseUid && !email) {
    return res
      .status(400)
      .json({ message: "firebaseUid or email is required" });
  }

  try {
    const query = firebaseUid ? { firebaseUid } : { email };

    const user = await userModel.findOne(query).populate("teamId", "name");

    if (!user) {
      return res.status(404).json({ message: "User not found in database" });
    }

    // Send back user details
    res.json({
      message: "User SingIn Successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        team: user.teamId
          ? {
              id: user.teamId._id,
              name: user.teamId.name,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Login server error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json({ message: "get all users sucessfully", users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
