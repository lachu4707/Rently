const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// Requires a valid token — used for profile, sell, recently-viewed writes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        res.status(401);
        throw new Error("User not found");
      }
      return next();
    } catch (err) {
      res.status(401);
      throw new Error("Not authorized, token invalid");
    }
  }

  res.status(401);
  throw new Error("Not authorized, no token");
});

// Attaches req.user if a valid token is present, but doesn't block the request
// if it's missing — useful for the public feed/search that behaves slightly
// differently for logged-in users.
const optionalAuth = asyncHandler(async (req, res, next) => {
  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
    } catch (err) {
      // ignore invalid token for optional auth
    }
  }
  next();
});

module.exports = { protect, optionalAuth };
