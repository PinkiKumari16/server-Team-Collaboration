import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ["todo", "in-progress", "done"],
    default: "todo",
  },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "projectModel" },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "userModel" },
});

export default mongoose.model("taskModel", taskSchema);
