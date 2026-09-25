const express = require("express");
const { protect, optionalAuth } = require("../middleware/authMiddleware");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

router.route("/").get(getProducts).post(optionalAuth, createProduct);

router
  .route("/:id")
  .get(getProductById)
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

module.exports = router;
