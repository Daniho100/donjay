import mongoose from "mongoose";

const carSaleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    mileage: {
      type: Number,
      required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    selectedFiles: {
      type: Array,
      required: true,
    },
    phone:{
        type: Number,
        required: true,
    },
    userRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
  },
  { timestamps: true }
);

const Car = mongoose.model("Car", carSaleSchema);

export default Car;

