require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { supabase } = require("./config/supabase");
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

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    database: "Supabase (Cloud PostgreSQL)",
    supabaseConfigured: Boolean(process.env.SUPABASE_URL && (process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/recently-viewed", recentlyViewedRoutes);
app.use("/api/about", aboutRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
if (process.env.NODE_ENV !== "production" || require.main === module) {
  app.listen(PORT, () => console.log(`RentalHub API Server running on port ${PORT} (Database: Supabase Cloud)`));
}

module.exports = app;
