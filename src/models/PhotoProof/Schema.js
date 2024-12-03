// models/PhotoProof.js
import mongoose from "mongoose"

const photoProofSchema = new mongoose.Schema({
    clerkId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    photoUrl: { type: String, required: true },
    activityRecognized: { type: String },
    pointsAwarded: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('PhotoProof', photoProofSchema);