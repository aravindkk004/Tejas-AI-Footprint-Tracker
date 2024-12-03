import mongoose from "mongoose";

const ContestSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true }, // Unique contest ID
  title: { type: String, required: true }, // Title of the contest
  what_to_do: { type: String, required: true }, // Task description
  obj: { type: String, required: true }, // Objective of the contest
  sub_process: { type: [String], default: [] }, // Steps to complete the contest
  scoring: { type: [String], default: [] }, // Scoring criteria
  verification_rules: { type: [String], default: [] }, // Rules for verifying submissions
  completion_reward: { type: [String], default: [] }, // Rewards for completing the contest
  timing: { type: Date, required: true }, // Contest date
  img: { type: String, required: true }, // Contest image URL
  registered_users: { type: [String], default: [] }, // Registered users' IDs or names
});

// Model creation (use singular name for convention)
const Contest =
  mongoose.models.Contest || mongoose.model("Contest", ContestSchema);

export default Contest;
