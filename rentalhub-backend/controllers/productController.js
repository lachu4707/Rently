const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");
const User = require("../models/User");

// @route GET /api/products
// Powers both the default Feed and the search/filter bar in the dashboard.
// Query params: q (search text), radius (max distanceKm), sort ('low' | 'high'), tag
const getProducts = asyncHandler(async (req, res) => {
  const { q, sort, tag } = req.query;

  const filter = { isAvailable: { $ne: false } };
  if (q && q.trim()) {
    filter.$or = [
      { title: { $regex: q.trim(), $options: "i" } },
      { description: { $regex: q.trim(), $options: "i" } },
      { tag: { $regex: q.trim(), $options: "i" } },
      { location: { $regex: q.trim(), $options: "i" } },
    ];
  }
  if (tag && tag !== "All") filter.tag = tag;

  let query = Product.find(filter).populate("owner", "name location");

  if (sort === "low") query = query.sort({ price: 1 });
  if (sort === "high") query = query.sort({ price: -1 });
  if (!sort) query = query.sort({ createdAt: -1 });

  const products = await query;
  res.json(products);
});

// @route GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    "owner",
    "name location phone"
  );
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json(product);
});

// @route POST /api/products  (the "Sell" form submits here)
const createProduct = asyncHandler(async (req, res) => {
  const { title, description, price, priceUnit, tag, location, images, coordinates } =
    req.body;

  if (!title || !description || !price || !tag || !location || !images?.length) {
    res.status(400);
    throw new Error("Missing required listing fields");
  }

  let ownerId = req.user?._id;
  if (!ownerId) {
    let demoUser = await User.findOne({ email: "demo@rentalhub.com" });
    if (!demoUser) {
      demoUser = await User.create({
        name: "Community Member",
        email: "demo@rentalhub.com",
        password: "password123",
        location: location || "Chennai",
      });
    }
    ownerId = demoUser._id;
  }

  const product = await Product.create({
    owner: ownerId,
    title,
    description,
    price,
    priceUnit: priceUnit || "day",
    tag,
    location,
    images,
    coordinates,
  });

  res.status(201).json(product);
});

// @route PUT /api/products/:id
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  if (product.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to edit this listing");
  }

  Object.assign(product, req.body);
  const updated = await product.save();
  res.json(updated);
});

// @route DELETE /api/products/:id
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  if (product.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this listing");
  }

  await product.deleteOne();
  res.json({ message: "Listing removed" });
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
