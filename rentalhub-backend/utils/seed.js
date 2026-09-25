require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const Product = require("../models/Product");

const demoProducts = [
  {
    title: "Canon EOS R6 Mirrorless Camera",
    price: 950,
    priceUnit: "day",
    location: "Anna Nagar, Chennai",
    tag: "Electronics",
    description:
      "Full-frame body with 24-105mm kit lens, two batteries, and a padded case included.",
    images: [
      "https://picsum.photos/seed/camera1/700/500",
      "https://picsum.photos/seed/camera2/700/500",
    ],
  },
  {
    title: "Trek Marlin 7 Mountain Bike",
    price: 300,
    priceUnit: "day",
    location: "Velachery, Chennai",
    tag: "Sports",
    description: "Hardtail 29er, disc brakes, size M frame. Helmet available on request.",
    images: ["https://picsum.photos/seed/bike1/700/500"],
  },
  {
    title: "DeWalt Cordless Drill Set",
    price: 180,
    priceUnit: "day",
    location: "T Nagar, Chennai",
    tag: "Tools",
    description: "20V drill with two batteries, charger, and a 30-piece bit set in a carry case.",
    images: ["https://picsum.photos/seed/drill1/700/500"],
  },
];

(async () => {
  await connectDB();

  let owner = await User.findOne({ email: "demo@rentalhub.com" });
  if (!owner) {
    owner = await User.create({
      name: "Demo Owner",
      email: "demo@rentalhub.com",
      password: "password123",
      location: "Chennai",
    });
    console.log("Created demo user: demo@rentalhub.com / password123");
  }

  await Product.deleteMany({ owner: owner._id });
  await Product.insertMany(demoProducts.map((p) => ({ ...p, owner: owner._id })));

  console.log("Seed complete.");
  await mongoose.disconnect();
  process.exit(0);
})();
