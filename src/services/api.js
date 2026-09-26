const API_BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
  (typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? "/api"
    : "http://localhost:5001/api");

export function getAuthToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("rentalhub_token");
}

export function getAuthUser() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("rentalhub_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAuthSession(token, user) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem("rentalhub_token", token);
  if (user) localStorage.setItem("rentalhub_user", JSON.stringify(user));
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("rentalhub_token");
  localStorage.removeItem("rentalhub_user");
}

export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to log in");
  }

  setAuthSession(data.token, {
    id: data.id || data._id,
    name: data.name,
    email: data.email,
  });

  return data;
}

export async function registerUser({ name, email, password, phone, location }) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, phone, location }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to register");
  }

  setAuthSession(data.token, {
    id: data.id || data._id,
    name: data.name,
    email: data.email,
  });

  return data;
}

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
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}/products`, {
    method: "POST",
    headers,
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

