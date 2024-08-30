const express = require("express");
const { sendMail } = require("../controllers/sendMailController");

const router = express.Router();

// POST route to send email
router.post("/send", sendMail);

module.exports = router;
