const asyncHandler = require("express-async-handler");
const RecentlyViewed = require("../models/RecentlyViewed");
const Product = require("../models/Product");

// @route POST /api/recently-viewed/:productId
// Call this from the frontend whenever a user opens the ProductModal.
const trackView = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await RecentlyViewed.findOneAndUpdate(
    { user: req.user._id, product: productId },
    { viewedAt: new Date() },
    { upsert: true, new: true }
  );

  res.status(200).json({ message: "View recorded" });
});

// @route GET /api/recently-viewed
const getRecentlyViewed = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 20;

  const entries = await RecentlyViewed.find({ user: req.user._id })
    .sort({ viewedAt: -1 })
    .limit(limit)
    .populate("product");

  // Filter out entries whose product may have been deleted since
  const products = entries.filter((e) => e.product).map((e) => e.product);
  res.json(products);
});

// @route DELETE /api/recently-viewed/:productId
const removeFromRecentlyViewed = asyncHandler(async (req, res) => {
  await RecentlyViewed.deleteOne({
    user: req.user._id,
    product: req.params.productId,
  });
  res.json({ message: "Removed from recently viewed" });
});

module.exports = { trackView, getRecentlyViewed, removeFromRecentlyViewed };
