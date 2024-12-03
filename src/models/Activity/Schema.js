import mongoose from "mongoose";

// Define the Activity schema
const activitySchema = new mongoose.Schema({
  clerkId: {
    type: String,
    ref: "User",
    required: true,
  },
  suggestions: {
    type: String,
    required: true,
    default: "Unknown Activity",
  },
  co2: {
    type: Number,
    required: true,
    default: 0,
  },
  reduction: {
    type: Number,
    required: true,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Define the Activity model
const Activity =
  mongoose.models.Activity || mongoose.model("Activity", activitySchema);

export default Activity;
