import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  await connectDB();
  const users = await User.find().sort({ createdAt: -1 }).select("+password");
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  await connectDB();
  const data = await req.json();

  if (!data.password || data.password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }

  const user = await User.create({
    name: data.name,
    phone: data.phone,
    email: data.email,
    role: data.role || "Customer",
    password: data.password,
  });

  return NextResponse.json({ ...user.toObject(), password: undefined }, { status: 201 });
}
