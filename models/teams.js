// models/Team.js
import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.model("teams", teamSchema);
