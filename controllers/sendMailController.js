// controllers/sendMailController.js

const nodemailer = require("nodemailer");
require("dotenv").config();

const sendMail = async (req, res) => {
  const { to, subject, text, html } = req.body;

  // Create a transporter using your email service
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.USER,
      pass: process.env.APP_PASSWORD,
    },
  });

  // Define mail options
  const mailOptions = {
    from: {
      name: "Jedybrown Ventures",
      address: process.env.USER,
    },
    to,
    subject,
    text,
    html,
  };

  try {
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log(`Message sent: ${info.messageId}`);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
};

module.exports = { sendMail };
