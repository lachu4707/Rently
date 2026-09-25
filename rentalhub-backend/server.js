require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const recentlyViewedRoutes = require("./routes/recentlyViewedRoutes");
const aboutRoutes = require("./routes/aboutRoutes");

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));
app.use(morgan("dev"));

// Ensure database is connected before handling any API requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Database connection error in request:", err.message);
    res.status(500).json({ message: "Database connection error: " + err.message });
  }
});

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes); // powers Feed, Search, Sell, ProductModal
app.use("/api/recently-viewed", recentlyViewedRoutes);
app.use("/api/about", aboutRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
if (process.env.NODE_ENV !== "production" || require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
