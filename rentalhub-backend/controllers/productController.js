const asyncHandler = require("express-async-handler");
const { getSupabaseClient } = require("../config/supabase");
const { formatProduct } = require("../utils/formatters");

// @route GET /api/products
// Powers Feed, Category Filters, Search in Dashboard
const getProducts = asyncHandler(async (req, res) => {
  const supabase = getSupabaseClient();
  const { q, sort, tag } = req.query;

  let query = supabase
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
    .eq("is_available", true);

  if (tag && tag !== "All") {
    query = query.eq("tag", tag);
  }

  if (q && q.trim()) {
    const term = `%${q.trim()}%`;
    query = query.or(`title.ilike.${term},description.ilike.${term},tag.ilike.${term},location.ilike.${term}`);
  }

  if (sort === "low") {
    query = query.order("price", { ascending: true });
  } else if (sort === "high") {
    query = query.order("price", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    res.status(500);
    throw new Error("Failed to fetch products: " + error.message);
  }

  const formatted = (data || []).map(formatProduct);
  res.json(formatted);
});

// @route GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
  const supabase = getSupabaseClient();
  const { id } = req.params;

  const { data, error } = await supabase
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
    .eq("id", id)
    .single();

  if (error || !data) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json(formatProduct(data));
});

// @route POST /api/products (The "Sell" form submits here)
const createProduct = asyncHandler(async (req, res) => {
  const supabase = getSupabaseClient();
  const { title, description, price, priceUnit, tag, location, images, coordinates } =
    req.body;

  if (!title || !description || !price || !tag || !location || !images?.length) {
    res.status(400);
    throw new Error("Missing required listing fields");
  }

  let ownerId = req.user?.id || req.user?._id;

  if (!ownerId) {
    // Check if demo user exists in Supabase
    const { data: demoUsers } = await supabase
      .from("users")
      .select("id")
      .eq("email", "demo@rentalhub.com")
      .limit(1);

    if (demoUsers && demoUsers.length > 0) {
      ownerId = demoUsers[0].id;
    } else {
      // Create fallback demo user
      const { data: newUser, error: userError } = await supabase
        .from("users")
        .insert({
          name: "RentalHub Member",
          email: "demo@rentalhub.com",
          password: "$2a$10$wN9aC04p2K3kOa3fEcmr..xS7g1zF37tEsqLqD7H4eO0jU5a1H9lS",
          location: location || "Chennai",
        })
        .select()
        .single();

      if (userError) {
        res.status(500);
        throw new Error("Could not initialize default user: " + userError.message);
      }
      ownerId = newUser.id;
    }
  }

  const newProductPayload = {
    owner_id: ownerId,
    title: title.trim(),
    description: description.trim(),
    price: Number(price),
    price_unit: priceUnit || "day",
    tag: tag.trim(),
    location: location.trim(),
    images: Array.isArray(images) ? images : [images],
    coordinates: coordinates || { lat: null, lng: null },
    is_available: true,
  };

  const { data, error } = await supabase
    .from("products")
    .insert(newProductPayload)
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
    .single();

  if (error) {
    res.status(500);
    throw new Error("Failed to create product listing: " + error.message);
  }

  res.status(201).json(formatProduct(data));
});

// @route PUT /api/products/:id
const updateProduct = asyncHandler(async (req, res) => {
  const supabase = getSupabaseClient();
  const { id } = req.params;
  const userId = req.user?.id || req.user?._id;

  const { data: existing, error: findError } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (findError || !existing) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (existing.owner_id !== userId) {
    res.status(403);
    throw new Error("Not authorized to edit this listing");
  }

  const updates = {};
  if (req.body.title) updates.title = req.body.title;
  if (req.body.description) updates.description = req.body.description;
  if (req.body.price !== undefined) updates.price = Number(req.body.price);
  if (req.body.priceUnit) updates.price_unit = req.body.priceUnit;
  if (req.body.tag) updates.tag = req.body.tag;
  if (req.body.location) updates.location = req.body.location;
  if (req.body.images) updates.images = req.body.images;
  if (req.body.isAvailable !== undefined) updates.is_available = req.body.isAvailable;
  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    res.status(500);
    throw new Error("Failed to update product: " + error.message);
  }

  res.json(formatProduct(data));
});

// @route DELETE /api/products/:id
const deleteProduct = asyncHandler(async (req, res) => {
  const supabase = getSupabaseClient();
  const { id } = req.params;
  const userId = req.user?.id || req.user?._id;

  const { data: existing, error: findError } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (findError || !existing) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (existing.owner_id !== userId) {
    res.status(403);
    throw new Error("Not authorized to delete this listing");
  }

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) {
    res.status(500);
    throw new Error("Failed to delete product: " + error.message);
  }

  res.json({ message: "Listing removed" });
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
