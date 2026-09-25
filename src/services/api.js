const API_BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
  (typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? "/api"
    : "http://localhost:5001/api");

export async function fetchProducts(params = {}) {
  try {
    const query = new URLSearchParams();
    if (params.q) query.append("q", params.q);
    if (params.sort) query.append("sort", params.sort);
    if (params.tag && params.tag !== "All") query.append("tag", params.tag);

    const queryString = query.toString();
    const url = `${API_BASE_URL}/products${queryString ? `?${queryString}` : ""}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch products`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn("Could not fetch products from backend API:", err.message);
    return null;
  }
}

export async function createProduct(productData) {
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

  if (!res.ok) {
    let errorMsg = "Failed to create product listing";
    try {
      const err = await res.json();
      if (err.message) errorMsg = err.message;
    } catch {}
    throw new Error(errorMsg);
  }

  return await res.json();
}

export async function fetchProductById(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!res.ok) throw new Error("Product not found");
    return await res.json();
  } catch (err) {
    console.warn("Error fetching product detail:", err.message);
    return null;
  }
}

export { API_BASE_URL };
