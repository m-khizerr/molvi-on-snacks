import { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: String,
    email: String,
    role: {
      type: String,
      enum: ["Admin", "Customer"],
      default: "Customer",
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // hide password by default
    },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default models.User || model("User", UserSchema);
