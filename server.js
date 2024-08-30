require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const app = express();

const PORT = process.env.PORT;

const HOST = process.env.HOST;

// Connect to database
connectDB();

// Import routes
const userBiodataRoutes = require("./routes/user_biodataRoutes");
const authRoutes = require("./routes/authRoutes");
const sendMailRoutes = require("./routes/sendMailRoutes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.CORS_ORIGIN,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);
app.use(morgan("dev"));

// Use Routes
app.use("/api/users", userBiodataRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/email", sendMailRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Backend Server for React Libraries!");
});

app.listen(PORT, () => {
  console.log(`Server is running on ${HOST}`);
});
