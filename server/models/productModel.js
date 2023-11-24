import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.ObjectId,
      ref: "Category",
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    mileage: {
      type: Number,
      required: true,
    },
    gearType: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    registration: {
      type: String,
      required: true,
    },
    selectedFiles: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Products", productSchema);

