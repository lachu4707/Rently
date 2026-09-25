const mongoose = require("mongoose");

const connectDB = async () => {
  let uri = process.env.MONGO_URI;

  if (uri) {
    try {
      const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 4000 });
      console.log(`MongoDB Atlas connected: ${conn.connection.host}`);
      return;
    } catch (atlasErr) {
      console.warn("MongoDB Atlas connection failed:", atlasErr.message);
      console.log("Falling back to local in-memory MongoDB database...");
    }
  }

  try {
    const { MongoMemoryServer } = require("mongodb-memory-server");
    const mongod = await MongoMemoryServer.create();
    uri = mongod.getUri();
    const conn = await mongoose.connect(uri);
    console.log(`Local in-memory MongoDB connected: ${conn.connection.host}`);

    // Automatically seed initial items in memory if empty
    const User = require("../models/User");
    const Product = require("../models/Product");
    const existing = await Product.countDocuments();
    if (existing === 0) {
      const owner = await User.create({
        name: "Demo Owner",
        email: "demo@rentalhub.com",
        password: "password123",
        location: "Chennai",
      });
      const demoProducts = [
        {
          title: "Canon EOS R6 Mirrorless Camera",
          price: 950,
          priceUnit: "day",
          location: "Anna Nagar, Chennai",
          tag: "Electronics",
          description: "Full-frame body with 24-105mm kit lens, two batteries, and a padded case included.",
          images: ["https://picsum.photos/seed/camera1/700/500", "https://picsum.photos/seed/camera2/700/500"],
          owner: owner._id,
        },
        {
          title: "Trek Marlin 7 Mountain Bike",
          price: 300,
          priceUnit: "day",
          location: "Velachery, Chennai",
          tag: "Sports",
          description: "Hardtail 29er, disc brakes, size M frame. Helmet available on request.",
          images: ["https://picsum.photos/seed/bike1/700/500"],
          owner: owner._id,
        },
        {
          title: "DeWalt Cordless Drill Set",
          price: 180,
          priceUnit: "day",
          location: "T Nagar, Chennai",
          tag: "Tools",
          description: "20V drill with two batteries, charger, and a 30-piece bit set in a carry case.",
          images: ["https://picsum.photos/seed/drill1/700/500"],
          owner: owner._id,
        },
        {
          title: "IKEA Study Table + Chair",
          price: 220,
          priceUnit: "week",
          location: "Adyar, Chennai",
          tag: "Furniture",
          description: "Compact desk with a matching chair, ideal for a short-term stay. Pickup only.",
          images: ["https://picsum.photos/seed/desk1/700/500"],
          owner: owner._id,
        },
        {
          title: "GoPro Hero 12 Action Camera",
          price: 400,
          priceUnit: "day",
          location: "Nungambakkam, Chennai",
          tag: "Electronics",
          description: "Comes with a chest mount, extra battery, and a 128GB memory card.",
          images: ["https://picsum.photos/seed/gopro1/700/500"],
          owner: owner._id,
        },
      ];
      await Product.insertMany(demoProducts);
      console.log("Seeded default listings into memory.");
    }
  } catch (err) {
    console.error("MongoDB connection fatal error:", err.message);
  }
};

module.exports = connectDB;