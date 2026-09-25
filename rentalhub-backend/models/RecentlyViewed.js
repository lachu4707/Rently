const mongoose = require("mongoose");

// One document per (user, product) pair. `viewedAt` is bumped on every re-view,
// so the list can be sorted most-recent-first without duplicates.
const recentlyViewedSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    viewedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

recentlyViewedSchema.index({ user: 1, product: 1 }, { unique: true });

module.exports = mongoose.model("RecentlyViewed", recentlyViewedSchema);
