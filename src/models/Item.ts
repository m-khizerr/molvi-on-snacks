import { Schema, model, models } from "mongoose";

const VariationSchema = new Schema(
  {
    label: { type: String, required: true }, // e.g. "250 ml", "500 ml", "6 pcs", "12 pcs"
    baseCost: { type: Number, default: 0 },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 0 }, // stock level for this variation
  },
  { _id: false } // variations are embedded subdocuments, no separate _id
);

const ItemSchema = new Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ["ice_cream", "samosa"], // restrict allowed item types
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    // ✅ New: variations array
    variations: {
      type: [VariationSchema],
      default: [],
    },
  },
  { timestamps: true, strict: true }
);

export default models.Item || model("Item", ItemSchema);
