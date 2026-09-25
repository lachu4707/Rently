const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Product = require("../models/Product");

// @route GET /api/users/me
const getProfile = asyncHandler(async (req, res) => {
  res.json(req.user);
});

// @route PUT /api/users/me
const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, location, avatarUrl, bio } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.name = name ?? user.name;
  user.phone = phone ?? user.phone;
  user.location = location ?? user.location;
  user.avatarUrl = avatarUrl ?? user.avatarUrl;
  user.bio = bio ?? user.bio;

  const updated = await user.save();
  res.json({
    _id: updated._id,
    name: updated.name,
    email: updated.email,
    phone: updated.phone,
    location: updated.location,
    avatarUrl: updated.avatarUrl,
    bio: updated.bio,
  });
});

// @route GET /api/users/me/listings
// Everything this user has listed under "Sell"
const getMyListings = asyncHandler(async (req, res) => {
  const listings = await Product.find({ owner: req.user._id }).sort({ createdAt: -1 });
  res.json(listings);
});

module.exports = { getProfile, updateProfile, getMyListings };
