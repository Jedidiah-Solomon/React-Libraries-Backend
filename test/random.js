const crypto = require("crypto");

// Generate a random secret key (16 bytes)
const secretKey = crypto.randomBytes(16).toString("hex"); // Generates a 32-character hexadecimal string
console.log(`Secret Key: ${secretKey}`);

//node test/random.js
