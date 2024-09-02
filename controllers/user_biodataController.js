const bcrypt = require("bcrypt");
const redisClient = require("../config/redisClient");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const nodemailer = require("nodemailer");
const UserBiodata = require("../models/user_biodataModel");

const generateSmsCode = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "JVN"; // Prefix
  for (let i = 0; i < 3; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

const sendSMS = async (phone, message) => {
  const url = `${process.env.TERMII_BASE_URL}/api/sms/send`;

  const payload = {
    to: phone,
    from: "Jedybrown",
    sms: message,
    type: "plain",
    channel: "generic",
    api_key: process.env.TERMII_API_KEY,
  };

  try {
    const response = await axios.post(url, payload, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("SMS sent successfully:", response.data);
  } catch (error) {
    console.error(
      "Error sending SMS:",
      error.response ? error.response.data : error.message
    );
  }
};

exports.signup = async (req, res) => {
  const { fullName, userName, email, password, phoneNumber } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await UserBiodata.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate SMS code
    const smsCode = generateSmsCode();
    console.log("Generated SMS Code:", smsCode);

    // Create new user
    const newUser = new UserBiodata({
      fullName,
      userName,
      email,
      password: hashedPassword,
      phoneNumber,
      smsCode,
    });

    // Save user to the database
    await newUser.save();

    // Send the SMS with the code
    await sendSMS(phoneNumber, `Your verification code is ${smsCode}`);

    // Setup email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER,
        pass: process.env.APP_PASSWORD,
      },
      // logger: true,
      // debug: true,
    });

    // Define email options
    const mailOptions = {
      from: {
        name: "Jedybrown Ventures",
        address: process.env.USER,
      },
      to: email,
      subject: "Welcome on Board, I am Jedidiah🤝",
      text: `Hi ${fullName},\n\nThank you for signing up for my service! I am excited to have you on board.\n\nBest regards,\nJedidiah Solomon, Software Developer\n\nCheck out my LinkedIn: https://is.gd/fcc4g0`, // Plain text body
      html: `
        <html>
        <body>
          <h2>Hi ${fullName},</h2>
          <p>Thank you for signing up for my service! I'm excited to have you on board.</p>
          <p>Best regards,</p>
          <p><strong>Jedidiah Solomon, Software Developer</strong></p>
          <p>Check out my LinkedIn: <a href="https://is.gd/fcc4g0" target="_blank">Jedidiah Solomon</a></p>
        </body>
        </html>
      `, // HTML body
    };

    // Send the email and log the info object
    const info = await transporter.sendMail(mailOptions);
    console.log(`Message sent: ${info.messageId}`);

    // Cache the new user's data in Redis (set to expire in 1 hour)
    await redisClient.setEx(email, 3600, JSON.stringify(newUser));

    // Respond to the client
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error registering user",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check Redis cache first
    const cachedUserData = await redisClient.get(email);
    let user;

    if (cachedUserData) {
      console.log("Serving from Redis cache");
      user = JSON.parse(cachedUserData);
    } else {
      user = await UserBiodata.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      // Store user data in Redis cache (set to expire in 1 hour)
      await redisClient.setEx(email, 3600, JSON.stringify(user));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1m",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 1 * 60 * 1000,
    });

    res.status(200).json({ message: "Logged in successfully" });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};
