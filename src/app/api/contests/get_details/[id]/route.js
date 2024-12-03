import { connectToDb } from "@/libs/connectToDb";
import UploadImg from "@/models/UploadImage/Schema";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { id } = await params;

  try {
    await connectToDb();
    const detail = await UploadImg.findOne({clerkId: id});
    const images= detail.images;
    return NextResponse.json(images, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error while fetching data" }, { status: 500 });
  }
}
