import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Item from "@/models/Item";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  await connectDB();
  const items = await Item.find().sort({ createdAt: -1 });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  await connectDB();

  console.log("🟢 [POST /api/items] Received request to create new item");

  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const unit = formData.get("unit") as string;
    const baseCost = parseFloat(formData.get("baseCost") as string);
    const price = parseFloat(formData.get("price") as string);
    const files = formData.getAll("images") as File[];

    console.log("📦 Parsed form data:");
    console.log("  • name:", name);
    console.log("  • unit:", unit);
    console.log("  • baseCost:", baseCost);
    console.log("  • price:", price);
    console.log("  • number of image files:", files.length);

    const uploadPromises = files.map(async (file, index) => {
      console.log(`🚀 Uploading image ${index + 1}/${files.length} to Cloudinary`);

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      return new Promise<string>((resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream(
          { folder: "items" },
          (error, result) => {
            if (error) {
              console.error(`❌ Cloudinary upload failed for image ${index + 1}:`, error);
              reject(error);
            } else {
              console.log(`✅ Uploaded image ${index + 1}:`, result?.secure_url);
              resolve(result!.secure_url);
            }
          }
        );
        upload.end(buffer);
      });
    });

    const imageUrls = await Promise.all(uploadPromises);
    console.log("🖼️ Cloudinary image URLs:", imageUrls);

    const itemData = {
      name,
      unit,
      baseCost,
      price,
      images: imageUrls,
    };

    console.log("💾 Saving item to MongoDB with data:", itemData);

    const item = await Item.create(itemData);

    console.log("✅ MongoDB document created successfully:", item);

    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    console.error("🔥 [ERROR] Failed to create item:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
