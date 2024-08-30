const express = require("express");
const { signup, login } = require("../controllers/user_biodataController");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/verifyToken", verifyToken, (req, res) => {
  res.status(200).json({ message: "Token is valid" });
});

module.exports = router;
