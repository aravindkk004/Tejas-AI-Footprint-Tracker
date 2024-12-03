import mongoose from "mongoose";

const UploadImgSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
  },
  contestId: {
    type: Number,
    required: true,
  },
  images: [],
});

const UploadImg =
  mongoose.models.UploadImg || mongoose.model("UploadImg", UploadImgSchema);
export default UploadImg;
