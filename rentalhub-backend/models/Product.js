const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    priceUnit: {
      type: String,
      enum: ["hour", "day", "week", "month"],
      default: "day",
    },
    tag: { type: String, required: true, trim: true }, // e.g. Electronics, Sports, Tools
    location: { type: String, required: true, trim: true },
    // lat/lng lets you compute real distanceKm later instead of hardcoding it
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    images: {
      type: [String],
      validate: (arr) => arr.length > 0,
      required: true,
    },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.index({ title: "text", tag: "text", location: "text" });

module.exports = mongoose.model("Product", productSchema);
