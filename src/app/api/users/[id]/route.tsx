import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const body = await req.json();

  const updateData: any = {
    name: body.name,
    phone: body.phone,
    email: body.email,
    role: body.role,
  };

  // Only hash password if provided
  if (body.password) {
    const salt = await bcrypt.genSalt(10);
    updateData.password = await bcrypt.hash(body.password, salt);
  }

  const updated = await User.findByIdAndUpdate(params.id, updateData, { new: true });
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await connectDB();
  await User.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}
