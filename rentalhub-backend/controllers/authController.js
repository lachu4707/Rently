const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { getSupabaseClient } = require("../config/supabase");
const { formatUser } = require("../utils/formatters");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || "rentalhub_supabase_jwt_secret_key_2026", {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// @route POST /api/auth/register
const registerUser = asyncHandler(async (req, res) => {
  const supabase = getSupabaseClient();
  const { name, email, password, phone, location } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email, and password are required");
  }

  const cleanEmail = email.toLowerCase().trim();

  // Check if user already exists
  const { data: existingUser } = await supabase
    .from("users")
    .select("id, email")
    .eq("email", cleanEmail)
    .maybeSingle();

  if (existingUser) {
    res.status(400);
    throw new Error("An account with this email already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const { data: user, error } = await supabase
    .from("users")
    .insert({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      phone: phone || "",
      location: location || "",
    })
    .select()
    .single();

  if (error) {
    res.status(500);
    throw new Error("Failed to register user: " + error.message);
  }

  res.status(201).json({
    _id: user.id,
    id: user.id,
    name: user.name,
    email: user.email,
    token: generateToken(user.id),
  });
});

// @route POST /api/auth/login
const loginUser = asyncHandler(async (req, res) => {
  const supabase = getSupabaseClient();
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const cleanEmail = email.toLowerCase().trim();

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", cleanEmail)
    .maybeSingle();

  if (error || !user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json({
    _id: user.id,
    id: user.id,
    name: user.name,
    email: user.email,
    token: generateToken(user.id),
  });
});

module.exports = { registerUser, loginUser };
