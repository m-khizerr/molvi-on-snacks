import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Item from "@/models/Item";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectDB();

  const formData = await req.formData();
  const name = formData.get("name") as string;
  const unit = formData.get("unit") as string;
  const baseCost = parseFloat(formData.get("baseCost") as string);
  const price = parseFloat(formData.get("price") as string);
  const files = formData.getAll("images") as File[];

  const uploadPromises = files.map(async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploaded = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "items" }, (error, result) => {
          if (error) reject(error);
          else resolve(result?.secure_url);
        })
        .end(buffer);
    });
    return uploaded;
  });

  const imageUrls = await Promise.all(uploadPromises);

  const updated = await Item.findByIdAndUpdate(
    params.id,
    { name, unit, baseCost, price, images: imageUrls },
    { new: true }
  );

  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await connectDB();
  await Item.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}
