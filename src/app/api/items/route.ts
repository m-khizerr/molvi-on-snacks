import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Item from "@/models/Item";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🟢 GET — Fetch all items
export async function GET() {
  await connectDB();
  const items = await Item.find().sort({ createdAt: -1 });
  return NextResponse.json(items);
}

// 🟢 POST — Create new item with variations + images
export async function POST(req: Request) {
  await connectDB();

  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const category = formData.get("category") as string; // "ice_cream" | "samosa"

    // Parse variations JSON
    const variationsRaw = formData.get("variations") as string | null;
    let variations = [];

    if (variationsRaw) {
      try {
        variations = JSON.parse(variationsRaw);
      } catch (err) {
        console.error("❌ Failed to parse variations JSON:", err);
        return NextResponse.json(
          { error: "Invalid variations format. Must be valid JSON." },
          { status: 400 }
        );
      }
    }

    const files = formData.getAll("images") as File[];

    // 🖼️ Upload each image to Cloudinary
    const uploadPromises = files.map(async (file, index) => {

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      return new Promise<string>((resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream(
          { folder: "items" },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result!.secure_url);
            }
          }
        );
        upload.end(buffer);
      });
    });

    const imageUrls = await Promise.all(uploadPromises);
    console.log("🖼️ Cloudinary image URLs:", imageUrls);

    // 🧩 Construct item data according to schema
    const itemData = {
      name,
      category,
      images: imageUrls,
      variations, // array of { label, baseCost, price, quantity }
    };

    const item = await Item.create(itemData);

    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    console.error("🔥 [ERROR] Failed to create item:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
