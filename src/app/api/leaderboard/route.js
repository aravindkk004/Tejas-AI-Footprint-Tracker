import { connectToDb } from "@/libs/connectToDb";
import User from "@/models/User/Schema";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(req) {
  try {
    await connectToDb();
    const { userId } = getAuth(req);
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
    const users = await User.find()
      .sort({ points: -1 })
      .limit(10)
      .select("username points");
    const currentUser = await User.findOne({ clerkId: userId }).select(
      "username points"
    );

    if (!currentUser) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }
    return new Response(
      JSON.stringify({
        users,
        currentUser,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
