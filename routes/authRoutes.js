const express = require("express");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/dashboard", verifyToken, (req, res) => {
  res.status(200).json({ message: "Welcome to the dashboard!" });
});

module.exports = router;
