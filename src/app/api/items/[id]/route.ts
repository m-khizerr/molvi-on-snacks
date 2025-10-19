import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Item from "@/models/Item";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🟢 UPDATE ITEM
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  await connectDB();

  try {
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const category = formData.get("category") as string; // "ice_cream" | "samosa"
    const unit = formData.get("unit") as string;
    const baseCost = parseFloat(formData.get("baseCost") as string);
    const price = parseFloat(formData.get("price") as string);
    const variationsRaw = formData.get("variations") as string | null;
    const files = formData.getAll("images") as File[];

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

    // Fetch existing item to preserve old images if none uploaded
    const existing = await Item.findById(id);
    if (!existing) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    let imageUrls: string[] = existing.images;

    // Upload new images if any
    if (files.length > 0) {
      const uploadPromises = files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        return new Promise<string>((resolve, reject) => {
          const upload = cloudinary.uploader.upload_stream(
            { folder: "items" },
            (error, result) => {
              if (error || !result?.secure_url)
                reject(error || new Error("Upload failed"));
              else resolve(result.secure_url);
            }
          );
          upload.end(buffer);
        });
      });

      const uploadedImages = await Promise.all(uploadPromises);
      imageUrls = uploadedImages;
    }

    // 🧩 Build update payload
    const updateData = {
      name,
      category,
      unit,
      baseCost,
      price,
      images: imageUrls,
      variations,
    };

    const updated = await Item.findByIdAndUpdate(id, updateData, { new: true });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("🔥 PUT /api/items/[id] failed:", error);
    return NextResponse.json(
      { error: "Failed to update item", details: error.message },
      { status: 500 }
    );
  }
}

// 🔴 DELETE ITEM
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  await connectDB();

  try {
    const item = await Item.findByIdAndDelete(id);

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // Optional: delete images from Cloudinary (if you want cleanup)
    // const deletePromises = item.images.map(async (url: string) => {
    //   const publicId = url.split("/").pop()?.split(".")[0];
    //   if (publicId) await cloudinary.uploader.destroy(`items/${publicId}`);
    // });
    // await Promise.all(deletePromises);

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("🔥 DELETE /api/items/[id] failed:", error);
    return NextResponse.json(
      { error: "Failed to delete item", details: error.message },
      { status: 500 }
    );
  }
}
