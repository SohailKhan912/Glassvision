const express = require("express");
const router = express.Router();

// Placeholder product routes
// These will be expanded as needed

router.get("/", (req, res) => {
  res.json({ message: "Products endpoint" });
});

router.post("/", (req, res) => {
  res.json({ message: "Create product endpoint" });
});

module.exports = router;
