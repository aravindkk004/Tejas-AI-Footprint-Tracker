import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
    },
    username: { type: String },
    email: { type: String, required: true },
    points: { type: Number, default: 0 },
    logActivity: { type: Boolean, default: false },
    registered_contests: [Number],
    contestPoints: { type: Number },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
