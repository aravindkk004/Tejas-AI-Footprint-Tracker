import Contest from "@/models/Contest/Schema";
import User from "@/models/User/Schema";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { contestId, userId } = await req.json();
    const contest = await Contest.findOne({id:contestId});
    if (!contest) {
      return NextResponse.json({ message: "Contest not found" }, { status: 404 });
    }
    if (contest.registered_users.includes(userId)) {
      return NextResponse.json({ message: "You have already registered" }, { status: 201 });
    }
    contest.registered_users.push(userId);
    await contest.save();
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    user.registered_contests.push(contestId);
    await user.save();
    return NextResponse.json({ message: "Successfully Registered" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error registering" }, { status: 500 });
  }
}
