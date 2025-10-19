import { Schema, model, models, Types } from "mongoose";

export type PaymentMethod = "Cash (CoD)" | "Online (EasyPaisa)" | "Online (JazzCash)" | "Card";
export type OrderType = "Customer" | "Wholesale" | "Walk-in";
export type OrderStatus = "Pending" | "Processing" | "Completed" | "Cancelled";

const OrderItemSchema = new Schema({
  item: { type: Types.ObjectId, ref: "Item", required: true },
  nameSnapshot: String,     // snapshot for history (optional)
  priceSnapshot: Number,    // price at sale time (optional)
  quantity: { type: Number, default: 1 },
}, { _id: false });

const OrderSchema = new Schema({
  orderNo: { type: Number, required: true, unique: true },   // your "ID: 1/2…"
  customer: { type: Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["Customer","Wholesale","Walk-in"], default: "Customer" },
  items: { type: [OrderItemSchema], default: [] },

  // money figures
  orderAmount: { type: Number, required: true },              // 1,100
  discount: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  deliveryCost: { type: Number, default: 0 },                 // your internal cost

  paymentMethod: { type: String, enum: ["Cash (CoD)", "Online (EasyPaisa)", "Online (JazzCash)", "Card"], required: true },
  status: { type: String, enum: ["Pending","Processing","Completed","Cancelled"], default: "Pending" },
  date: { type: Date, required: true },                       // e.g., "2025-09-05"
}, { timestamps: true });

export default models.Order || model("Order", OrderSchema);
