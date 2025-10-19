import { Schema, model, models, Types } from "mongoose";

export type PaymentMethod =
  | "Cash (CoD)"
  | "Online (EasyPaisa)"
  | "Online (JazzCash)"
  | "Card";

export type OrderType = "Customer" | "Wholesale" | "Walk-in";
export type OrderStatus = "Pending" | "Processing" | "Completed" | "Cancelled";

// Each ordered variation (instead of a flat price)
const OrderItemSchema = new Schema(
  {
    item: { type: Types.ObjectId, ref: "Item", required: true },

    // snapshot for history so old prices/labels remain even if item updates later
    nameSnapshot: { type: String, required: true },
    variationSnapshot: {
      label: { type: String, required: true },
      baseCost: { type: Number, required: true },
      price: { type: Number, required: true },
    },

    quantity: { type: Number, default: 1 },
    subtotal: { type: Number, required: true }, // price * quantity at sale time
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    orderNo: { type: Number, required: true, unique: true },
    customer: { type: Types.ObjectId, ref: "User", required: true },

    type: {
      type: String,
      enum: ["Customer", "Wholesale", "Walk-in"],
      default: "Customer",
    },
    items: { type: [OrderItemSchema], default: [] },

    // totals and cost breakdown
    orderAmount: { type: Number, required: true }, // total after discounts
    discount: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    deliveryCost: { type: Number, default: 0 },

    paymentMethod: {
      type: String,
      enum: ["Cash (CoD)", "Online (EasyPaisa)", "Online (JazzCash)", "Card"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Completed", "Cancelled"],
      default: "Pending",
    },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

export default models.Order || model("Order", OrderSchema);
