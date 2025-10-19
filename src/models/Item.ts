import { Schema, model, models } from "mongoose";

const ItemSchema = new Schema(
  {
    name: { type: String, required: true },
    unit: { type: String },
    baseCost: { type: Number, default: 0 },
    price: { type: Number, required: true },
    // ✅ FIXED — ensure Mongoose knows images is an array of strings
    images: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true, strict: true } // enforce schema consistency
);

export default models.Item || model("Item", ItemSchema);
