import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["ADMIN", "MANAGER", "MEMBER"],
    default: "MEMBER",
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "teams",
  },
});

export default mongoose.model("userModel", userSchema);
