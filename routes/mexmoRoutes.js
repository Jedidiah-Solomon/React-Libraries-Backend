const express = require("express");
const router = express.Router();
const { sendSMS } = require("../controllers/mexmoController");

// Route to send SMS
router.post("/send-sms", sendSMS);

module.exports = router;
