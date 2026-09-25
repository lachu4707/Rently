const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  trackView,
  getRecentlyViewed,
  removeFromRecentlyViewed,
} = require("../controllers/recentlyViewedController");

const router = express.Router();

router.get("/", protect, getRecentlyViewed);
router.post("/:productId", protect, trackView);
router.delete("/:productId", protect, removeFromRecentlyViewed);

module.exports = router;
