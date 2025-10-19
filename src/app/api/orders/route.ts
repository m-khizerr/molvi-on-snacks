import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";

// Helper: Start and end of current month
function getMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return { start, end };
}

// -------------------- GET (All Orders + Stats) --------------------
export async function GET() {
  await connectDB();
  const orders = await Order.find().populate("customer").sort({ createdAt: -1 });

  const { start, end } = getMonthRange();
  const thisMonthOrders = orders.filter(
    (o) => new Date(o.date) >= start && new Date(o.date) < end
  );

  const stats = {
    totalOrders: orders.length,
    totalOrdersThisMonth: thisMonthOrders.length,
    earningsThisMonth: thisMonthOrders.reduce(
      (sum, o) => sum + (o.orderPlusDelivery || 0),
      0
    ),
  };

  return NextResponse.json({ orders, stats });
}

// -------------------- POST (Create New Order) --------------------
export async function POST(req: Request) {
  await connectDB();
  const data = await req.json();

  try {
    // Get last orderNo and increment
    const lastOrder = await Order.findOne().sort({ orderNo: -1 }).limit(1);
    const nextOrderNo = lastOrder ? lastOrder.orderNo + 1 : 1;

    // Customer logic
    let customer = await User.findOne({
      name: { $regex: new RegExp(`^${data.customer}$`, "i") },
    });

    if (!customer) {
      customer = await User.create({
        name: data.customer,
        phone: data.customerPhone || "",
        role: "Customer",
        password: "user1234"
      });
    } else if (data.customerPhone && !customer.phone) {
      customer.phone = data.customerPhone;
      await customer.save();
    }

    const newOrder = await Order.create({
      ...data,
      orderNo: nextOrderNo,
      customer: customer._id,
    });

    const populated = await newOrder.populate("customer");
    return NextResponse.json(populated, { status: 201 });
  } catch (err: any) {
    console.error("Order creation error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
