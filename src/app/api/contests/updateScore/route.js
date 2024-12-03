import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { connectToDb } from "@/libs/connectToDb";
import { NextResponse } from "next/server";
import fs from "fs";
import os from "os";
import path from "path";
import axios from "axios";
import UploadImg from "@/models/UploadImage/Schema";
import User from "@/models/User/Schema";

const s3 = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST(req) {
  try {
    const payload = await req.json();
    const fileName = payload.fileName;
    const imageUrl = payload.imagePreviewUrl;
    const { category, contestId, userId } = payload;

    if (!contestId || !userId || !category || !imageUrl) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const response = await axios({
      method: "get",
      url: imageUrl,
      responseType: "stream",
    });

    const tempDir = os.tmpdir();
    const tempImagePath = path.join(
      tempDir,
      Date.now() + path.extname(imageUrl)
    );

    const writer = fs.createWriteStream(tempImagePath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    const fileStream = fs.createReadStream(tempImagePath);
    const bucketName = "recbuck";
    const objectKey = `${Date.now()}-${fileName}`;
    const uploadParams = {
      Bucket: bucketName,
      Key: objectKey,
      Body: fileStream,
      ContentType: response.headers["content-type"],
    };

    await s3.send(new PutObjectCommand(uploadParams));
    const s3ImageUrl = `https://${bucketName}.s3.amazonaws.com/${objectKey}`;
    fs.unlinkSync(tempImagePath);

    await connectToDb();
    const imagePath = s3ImageUrl;
    let uploadImage = await UploadImg.findOne({
      clerkId: userId,
      contestId: String(contestId), // Convert contestId to string
    });

    if (!uploadImage) {
      uploadImage = new UploadImg({
        clerkId: userId,
        contestId: Number(contestId), // Ensure consistent type
        images: [],
      });
    }
    uploadImage.images.push(imagePath);
    await uploadImage.save();
    const userPoint = await User.findOne({clerkId: userId});
    userPoint.contestPoints = uploadImage.images.length || 0
    await userPoint.save();
    return NextResponse.json({
      message: "File uploaded successfully",
      uploadImage
    }, {status: 200});
  } catch (error) {
    return NextResponse.json(
      { message: "Error while processing the data" },
      { status: 500 }
    );
  }
}
