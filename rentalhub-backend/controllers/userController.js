const asyncHandler = require("express-async-handler");
const { getSupabaseClient } = require("../config/supabase");
const { formatUser, formatProduct } = require("../utils/formatters");

// @route GET /api/users/me
const getProfile = asyncHandler(async (req, res) => {
  res.json(formatUser(req.user));
});

// @route PUT /api/users/me
const updateProfile = asyncHandler(async (req, res) => {
  const supabase = getSupabaseClient();
  const { name, phone, location, avatarUrl, bio } = req.body;
  const userId = req.user?.id || req.user?._id;

  const updates = {};
  if (name !== undefined) updates.name = name;
  if (phone !== undefined) updates.phone = phone;
  if (location !== undefined) updates.location = location;
  if (avatarUrl !== undefined) updates.avatar_url = avatarUrl;
  if (bio !== undefined) updates.bio = bio;
  updates.updated_at = new Date().toISOString();

  const { data: updated, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error || !updated) {
    res.status(500);
    throw new Error("Failed to update profile: " + (error?.message || "User not found"));
  }

  res.json(formatUser(updated));
});

// @route GET /api/users/me/listings
// Everything this user has listed under "Sell"
const getMyListings = asyncHandler(async (req, res) => {
  const supabase = getSupabaseClient();
  const userId = req.user?.id || req.user?._id;

  const { data: listings, error } = await supabase
    .from("products")
    .select(`
      *,
      owner:users (
        id,
        name,
        location,
        phone,
        avatar_url
      )
    `)
    .eq("owner_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    res.status(500);
    throw new Error("Failed to fetch user listings: " + error.message);
  }

  res.json((listings || []).map(formatProduct));
});

module.exports = { getProfile, updateProfile, getMyListings };
