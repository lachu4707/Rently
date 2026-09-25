const asyncHandler = require("express-async-handler");
const { getSupabaseClient } = require("../config/supabase");
const { formatProduct } = require("../utils/formatters");

// @route POST /api/recently-viewed/:productId
// Called when a user clicks/opens a Product
const trackView = asyncHandler(async (req, res) => {
  const supabase = getSupabaseClient();
  const { productId } = req.params;
  const userId = req.user?.id || req.user?._id;

  // Verify product exists
  const { data: product, error: findError } = await supabase
    .from("products")
    .select("id")
    .eq("id", productId)
    .single();

  if (findError || !product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Upsert recently_viewed record
  const { error: upsertError } = await supabase
    .from("recently_viewed")
    .upsert(
      {
        user_id: userId,
        product_id: productId,
        viewed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,product_id" }
    );

  if (upsertError) {
    res.status(500);
    throw new Error("Failed to record view: " + upsertError.message);
  }

  res.status(200).json({ message: "View recorded" });
});

// @route GET /api/recently-viewed
const getRecentlyViewed = asyncHandler(async (req, res) => {
  const supabase = getSupabaseClient();
  const userId = req.user?.id || req.user?._id;
  const limit = Number(req.query.limit) || 20;

  const { data: entries, error } = await supabase
    .from("recently_viewed")
    .select(`
      viewed_at,
      product:products (
        *,
        owner:users (
          id,
          name,
          location,
          phone,
          avatar_url
        )
      )
    `)
    .eq("user_id", userId)
    .order("viewed_at", { ascending: false })
    .limit(limit);

  if (error) {
    res.status(500);
    throw new Error("Failed to fetch recently viewed items: " + error.message);
  }

  const products = (entries || [])
    .filter((e) => e.product)
    .map((e) => formatProduct(e.product));

  res.json(products);
});

// @route DELETE /api/recently-viewed/:productId
const removeFromRecentlyViewed = asyncHandler(async (req, res) => {
  const supabase = getSupabaseClient();
  const userId = req.user?.id || req.user?._id;
  const { productId } = req.params;

  const { error } = await supabase
    .from("recently_viewed")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);

  if (error) {
    res.status(500);
    throw new Error("Failed to remove from recently viewed: " + error.message);
  }

  res.json({ message: "Removed from recently viewed" });
});

module.exports = { trackView, getRecentlyViewed, removeFromRecentlyViewed };
