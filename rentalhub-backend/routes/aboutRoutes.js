const express = require("express");
const router = express.Router();

// Simple static endpoint — swap for a DB-backed model later if you want
// About Us content to be editable from an admin panel.
router.get("/", (req, res) => {
  res.json({
    title: "About RentalHub",
    body:
      "RentalHub connects people who need something for a short while with " +
      "neighbours who already own it — cameras, tools, bikes, and more, " +
      "available to rent by the day, week, or month.",
    contactEmail: "support@rentalhub.example.com",
  });
});

module.exports = router;
