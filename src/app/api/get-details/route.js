import { connectToDb } from "@/libs/connectToDb";
import User from "@/models/User/Schema";
import { getAuth } from "@clerk/nextjs/server"; // Correct import
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectToDb();
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const activity = user.logActivity || false;
    return NextResponse.json({ message: activity }, { status: 200 });
  } catch (error) {
    console.log("Error in GET /api/get-details:", error);
    return NextResponse.json(
      { message: "Failed to fetch details" },
      { status: 500 }
    );
  }
}
