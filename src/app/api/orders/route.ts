import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Item from "@/models/Item";
import User from "@/models/User";

// -------------------- Helpers --------------------
function getMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return { start, end };
}

// -------------------- GET (All Orders + Stats) --------------------
export async function GET() {
  await connectDB();

  const orders = await Order.find()
    .populate("customer")
    .sort({ createdAt: -1 });

  const { start, end } = getMonthRange();
  const thisMonthOrders = orders.filter(
    (o) => new Date(o.date) >= start && new Date(o.date) < end
  );

  const stats = {
    totalOrders: orders.length,
    totalOrdersThisMonth: thisMonthOrders.length,
    earningsThisMonth: thisMonthOrders.reduce(
      (sum, o) => sum + (o.orderAmount || 0),
      0
    ),
  };

  return NextResponse.json({ orders, stats });
}

// -------------------- POST (Create New Order) --------------------
export async function POST(req: Request) {
  await connectDB();

  try {
    const data = await req.json();

    // Get last orderNo and increment
    const lastOrder = await Order.findOne().sort({ orderNo: -1 }).limit(1);
    const nextOrderNo = lastOrder ? lastOrder.orderNo + 1 : 1;

    // ---------------- Customer logic ----------------
    let customer = await User.findOne({
      name: { $regex: new RegExp(`^${data.customer}$`, "i") },
    });

    if (!customer) {
      customer = await User.create({
        name: data.customer,
        phone: data.customerPhone || "",
        role: "Customer",
        password: "user1234",
      });
    } else if (data.customerPhone && !customer.phone) {
      customer.phone = data.customerPhone;
      await customer.save();
    }

    // ---------------- Items processing ----------------
    // Expected input format example:
    // items: [
    //   { itemId: "6713bf02cf1a9c23f9019abc", variationLabel: "250ml", quantity: 2 }
    // ]

    const processedItems = [];
    let total = 0;

    for (const i of data.items) {
      const itemDoc = await Item.findById(i.item);
      if (!itemDoc) throw new Error(`Item not found: ${i.item}`);

      const variation = itemDoc.variations.find(
        (v: any) => v.label === i.variation
      );
      if (!variation)
        throw new Error(
          `Variation "${i.variation}" not found for item ${itemDoc.name}`
        );

      const subtotal = variation.price * (i.quantity || 1);

      processedItems.push({
        item: itemDoc._id,
        nameSnapshot: itemDoc.name,
        variationSnapshot: {
          label: variation.label,
          baseCost: variation.baseCost,
          price: variation.price,
        },
        quantity: i.quantity || 1,
        subtotal,
      });

      total += subtotal;
    }

    const orderAmount =
      total - (data.discount || 0) + (data.deliveryFee || 0);

    // ---------------- Create Order ----------------
    const newOrder = await Order.create({
      orderNo: nextOrderNo,
      customer: customer._id,
      type: data.type || "Customer",
      items: processedItems,
      orderAmount,
      discount: data.discount || 0,
      deliveryFee: data.deliveryFee || 0,
      deliveryCost: data.deliveryCost || 0,
      paymentMethod: data.paymentMethod,
      status: data.status || "Pending",
      date: data.date ? new Date(data.date) : new Date(),
    });

    const populated = await newOrder.populate("customer");
    return NextResponse.json(populated, { status: 201 });
  } catch (err: any) {
    console.error("Order creation error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
