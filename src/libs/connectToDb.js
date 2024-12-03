import Mongoose from "mongoose";

export const connectToDb = async () => {
  try {
    await Mongoose.connect(process.env.MONGO_URI);
    console.log("mongodb connected");
  } catch (error) {
    console.log("Error connecting to mongodb", error);
  }
};