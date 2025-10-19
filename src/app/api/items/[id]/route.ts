import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Item from "@/models/Item";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ await here
  await connectDB();

  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const unit = formData.get("unit") as string;
    const baseCost = parseFloat(formData.get("baseCost") as string);
    const price = parseFloat(formData.get("price") as string);
    const files = formData.getAll("images") as File[];

    const uploadPromises = files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploaded = await new Promise<string>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "items" }, (error, result) => {
            if (error || !result?.secure_url) reject(error || new Error("Upload failed"));
            else resolve(result.secure_url);
          })
          .end(buffer);
      });
      return uploaded;
    });

    const imageUrls = await Promise.all(uploadPromises);

    const updated = await Item.findByIdAndUpdate(
      id,
      { name, unit, baseCost, price, images: imageUrls },
      { new: true }
    );

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("PUT /api/items/[id] failed:", error);
    return NextResponse.json(
      { error: "Failed to update item", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ await here
  await connectDB();

  try {
    await Item.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("DELETE /api/items/[id] failed:", error);
    return NextResponse.json(
      { error: "Failed to delete item", details: error.message },
      { status: 500 }
    );
  }
}
