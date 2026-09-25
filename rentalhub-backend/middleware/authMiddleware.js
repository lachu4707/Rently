const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { getSupabaseClient } = require("../config/supabase");

// Requires a valid token — used for profile, sell, recently-viewed writes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "rentalhub_supabase_jwt_secret_key_2026"
      );

      const supabase = getSupabaseClient();
      const { data: user, error } = await supabase
        .from("users")
        .select("id, name, email, phone, location, avatar_url, bio")
        .eq("id", decoded.id)
        .single();

      if (error || !user) {
        res.status(401);
        throw new Error("User not found");
      }

      req.user = {
        ...user,
        _id: user.id,
      };

      return next();
    } catch (err) {
      res.status(401);
      throw new Error("Not authorized, token invalid");
    }
  }

  res.status(401);
  throw new Error("Not authorized, no token");
});

// Attaches req.user if a valid token is present, but doesn't block the request if missing
const optionalAuth = asyncHandler(async (req, res, next) => {
  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "rentalhub_supabase_jwt_secret_key_2026"
      );

      const supabase = getSupabaseClient();
      const { data: user } = await supabase
        .from("users")
        .select("id, name, email, phone, location, avatar_url, bio")
        .eq("id", decoded.id)
        .single();

      if (user) {
        req.user = {
          ...user,
          _id: user.id,
        };
      }
    } catch (err) {
      // ignore invalid token for optional auth
    }
  }
  next();
});

module.exports = { protect, optionalAuth };
