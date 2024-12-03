import { NextResponse } from "next/server";
import Activity from "@/models/Activity/Schema";
import { connectToDb } from "@/libs/connectToDb";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(req) {
  const { userId } = getAuth(req);
  await connectToDb();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const breakdown = await Activity.aggregate([
      { $match: { clerkId: userId } },
      {
        $group: {
          _id: null,
          totalEmission: { $sum: "$co2" },
          totalReduction: { $sum: "$reduction" },
        },
      },
    ]);

    const response = [
      { _id: "Emission", totalCo2: breakdown[0]?.totalEmission || 0 },
      { _id: "Reduction", totalCo2: breakdown[0]?.totalReduction || 0 },
    ];

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error fetching data." },
      { status: 500 }
    );
  }
}
