import { connectToDb } from "@/libs/connectToDb";
import { NextResponse } from "next/server";
import Contest from "@/models/Contest/Schema";

export async function GET() {
  try {
    await connectToDb();
    console.log("Database connected successfully");
    const contests = await Contest.find();
    return NextResponse.json(contests, { status: 200 });
  } catch (error) {
    console.error("Error fetching contests:", error); 
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}


