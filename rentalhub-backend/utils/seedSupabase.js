require("dotenv").config();
const { getSupabaseClient } = require("../config/supabase");

const demoUser = {
  id: "a0000000-0000-0000-0000-000000000001",
  name: "RentalHub Community Member",
  email: "demo@rentalhub.com",
  password: "$2a$10$wN9aC04p2K3kOa3fEcmr..xS7g1zF37tEsqLqD7H4eO0jU5a1H9lS", // "password123"
  phone: "+91 98765 43210",
  location: "Chennai, Tamil Nadu",
  bio: "Verified community member lending quality gear, electronics, and camping equipment.",
};

const demoProducts = [
  {
    title: "Sony Alpha A7 III Full-Frame Camera with 28-70mm Lens",
    description:
      "Professional 24.2MP mirrorless camera in pristine condition. Includes 2 batteries, 64GB fast SD card, charger, and camera bag. Perfect for weddings, travel photography, and 4K video shoots.",
    price: 1499,
    price_unit: "day",
    tag: "Electronics",
    location: "T. Nagar, Chennai",
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
    ],
    is_available: true,
  },
  {
    title: "Bosch Professional Cordless Hammer Drill Kit (18V)",
    description:
      "Heavy duty cordless drill with hammer function, 2x 4.0Ah batteries, rapid charger, and 30-piece masonry & metal bit set in hard case. Ideal for home improvement and DIY carpentry.",
    price: 350,
    price_unit: "day",
    tag: "Tools & Equipment",
    location: "Adyar, Chennai",
    images: [
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80",
    ],
    is_available: true,
  },
  {
    title: "Quechua Waterproof 4-Person Camping Tent + 2 Sleeping Bags",
    description:
      "Spacious 4-person dome tent with double skin for weatherproofing and ventilation. Easy 10-minute setup. Includes ground pegs, carry bag, and 2 clean sleeping bags.",
    price: 499,
    price_unit: "day",
    tag: "Sports & Fitness",
    location: "Velachery, Chennai",
    images: [
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80",
    ],
    is_available: true,
  },
  {
    title: "Epson Full HD 1080p Home Theater Projector + 100\" Screen",
    description:
      "3400 Lumens high brightness cinema projector with HDMI/Wireless casting support and built-in speakers. Comes with foldable 100-inch screen and tripod stand for movie nights.",
    price: 799,
    price_unit: "day",
    tag: "Electronics",
    location: "Anna Nagar, Chennai",
    images: [
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80",
    ],
    is_available: true,
  },
  {
    title: "Trek Marlin 7 Mountain Bike (Hydraulic Disc Brakes, 29\")",
    description:
      "Lightweight aluminum frame MTB with front suspension lockout and Shimano 1x10 drivetrain. Helmet, bottle cage, and bike lock included. Suitable for city trails and road cycling.",
    price: 599,
    price_unit: "day",
    tag: "Vehicles",
    location: "Besant Nagar, Chennai",
    images: [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80",
    ],
    is_available: true,
  },
];

async function seed() {
  try {
    const supabase = getSupabaseClient();
    console.log("Connecting to Supabase...");

    // 1. Insert or update demo user
    const { data: user, error: userError } = await supabase
      .from("users")
      .upsert(demoUser, { onConflict: "email" })
      .select()
      .single();

    if (userError) {
      throw new Error("Error seeding user: " + userError.message);
    }
    console.log(`Demo user ready: ${user.email} (${user.id})`);

    // 2. Insert demo products
    const productsToInsert = demoProducts.map((p) => ({
      ...p,
      owner_id: user.id,
    }));

    const { data: products, error: prodError } = await supabase
      .from("products")
      .insert(productsToInsert)
      .select();

    if (prodError) {
      throw new Error("Error seeding products: " + prodError.message);
    }

    console.log(`Successfully seeded ${products.length} products to Supabase!`);
    process.exit(0);
  } catch (err) {
    console.error("Supabase seed failed:", err.message);
    process.exit(1);
  }
}

seed();
