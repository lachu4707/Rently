const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getProfile,
  updateProfile,
  getMyListings,
} = require("../controllers/userController");

const router = express.Router();

router.get("/me", protect, getProfile);
router.put("/me", protect, updateProfile);
router.get("/me/listings", protect, getMyListings);

module.exports = router;
