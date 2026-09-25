/**
 * Format a Supabase product record for frontend consumption.
 * Normalizes snake_case fields and ensures compatibility with React components.
 */
function formatProduct(p) {
  if (!p) return null;

  let owner = p.owner || p.users || null;
  if (owner) {
    owner = {
      id: owner.id,
      _id: owner.id,
      name: owner.name,
      location: owner.location || "",
      phone: owner.phone || "",
      avatarUrl: owner.avatar_url || owner.avatarUrl || "",
    };
  }

  return {
    id: p.id,
    _id: p.id,
    title: p.title,
    description: p.description,
    price: Number(p.price),
    priceUnit: p.price_unit || p.priceUnit || "day",
    tag: p.tag,
    location: p.location,
    coordinates: p.coordinates || { lat: null, lng: null },
    images: Array.isArray(p.images) ? p.images : [],
    isAvailable: p.is_available !== undefined ? p.is_available : true,
    owner: owner || { _id: p.owner_id, id: p.owner_id, name: "Community Member", location: p.location },
    createdAt: p.created_at || p.createdAt,
    updatedAt: p.updated_at || p.updatedAt,
  };
}

/**
 * Format a Supabase user record for frontend consumption.
 */
function formatUser(u) {
  if (!u) return null;
  return {
    id: u.id,
    _id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone || "",
    location: u.location || "",
    avatarUrl: u.avatar_url || u.avatarUrl || "",
    bio: u.bio || "",
    createdAt: u.created_at,
    updatedAt: u.updated_at,
  };
}

module.exports = { formatProduct, formatUser };
