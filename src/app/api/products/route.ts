import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

// GET all products
export async function GET() {
  await connectDB();
  const products = await Product.find();
  return NextResponse.json(products);
}

// POST new product
export async function POST(req: Request) {
  await connectDB();
  const data = await req.json();
  const newProduct = await Product.create(data);
  return NextResponse.json(newProduct, { status: 201 });
}
