// Import mongoose
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teams",
    },
  },
  { timestamps: true }
);

// Export the Project model
export default mongoose.model("projectModel", projectSchema);
