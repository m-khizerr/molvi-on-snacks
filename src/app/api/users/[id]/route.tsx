import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ await the promise
  await connectDB();

  try {
    const body = await request.json();

    const updateData: any = {
      name: body.name,
      phone: body.phone,
      email: body.email,
      role: body.role,
    };

    // ✅ Only hash password if provided
    if (body.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(body.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedUser)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error("❌ PUT /api/users/[id] failed:", error);
    return NextResponse.json(
      { error: "Failed to update user", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ await here too
  await connectDB();

  try {
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("❌ DELETE /api/users/[id] failed:", error);
    return NextResponse.json(
      { error: "Failed to delete user", details: error.message },
      { status: 500 }
    );
  }
}
