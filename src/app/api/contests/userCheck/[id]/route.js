import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { connectToDb } from "@/libs/connectToDb";
import User from "@/models/User/Schema";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { message: "Contest ID is missing" },
        { status: 400 }
      );
    }
    await connectToDb();
    const { userId } = getAuth(req);
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
    const userData = await User.findOne({ clerkId: userId });
    if (!userData) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }
    const userStatus = userData.registered_contests.includes(Number(id)) || false;
    console.log('User Status:', userStatus); 
    return NextResponse.json(userStatus, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error while fetching" },
      { status: 500 }
    );
  }
}
