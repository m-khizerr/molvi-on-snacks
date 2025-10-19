import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

const UpdateOrderZ = z.object({
  // all optional for partial updates
  orderNo: z.number().optional(),
  customer: z.string().optional(),
  type: z.enum(["Customer","Wholesale","Walk-in"]).optional(),
  items: z.array(z.object({
    item: z.string(),
    quantity: z.number().int().min(1),
    notes: z.string().optional(),
    nameSnapshot: z.string().optional(),
    priceSnapshot: z.number().optional(),
  })).optional(),
  orderAmount: z.number().optional(),
  orderPlusDelivery: z.number().optional(),
  storeAmount: z.number().optional(),
  discount: z.number().optional(),
  deliveryFee: z.number().optional(),
  deliveryCost: z.number().optional(),
  costAmount: z.number().optional(),
  profitLoss: z.number().optional(),
  currency: z.string().optional(),
  paymentMethod: z.enum(["Cash (CoD)", "Online (EasyPaisa)", "Online (JazzCash)", "Card"]).optional(),
  status: z.enum(["Pending","Processing","Completed","Cancelled"]).optional(),
  date: z.coerce.date().optional(),
  notes: z.string().optional(),
});

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const order = await Order.findById(params.id)
    .populate("customer", "name phone")
    .populate("items.item", "name price");
  return NextResponse.json(order);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const body = await req.json();
  const parsed = UpdateOrderZ.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const updated = await Order.findByIdAndUpdate(params.id, parsed.data, { new: true })
    .populate("customer", "name phone")
    .populate("items.item", "name price");
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await connectDB();
  await Order.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}
