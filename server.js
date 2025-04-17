const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));


// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 50000,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Define Query Schema
const querySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  category: { type: String, required: true }, // Added for Rocky
  query: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const Query = mongoose.model("Query", querySchema);

// Nodemailer Setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

app.get("/faq", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "faq.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "about.html"));
});

// Submit Query
app.post("/api/submit-query", async (req, res) => {
  console.log("Received Query:", req.body); // Debug log
  const { name, email, category, query } = req.body;

  try {
    // Validate input
    if (!name || !email || !category || !query) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Save to MongoDB
    const newQuery = new Query({ name, email, category, query });
    await newQuery.save();

    // Send email to user
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Thank you for your query, ${name}!`,
      text: `Hello ${name},\n\nWe received your query:\nCategory: ${category}\nQuery: ${query}\n\nA senior from IIITDM will get back to you soon.\n\nBest Regards,\nIIITDM Support Team`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Query submitted successfully! You will receive a confirmation email shortly." });
  } catch (err) {
    console.error("❌ Error submitting query:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Get All Queries (Admin Panel)
app.get("/api/get-queries", async (req, res) => {
  try {
    const queries = await Query.find().sort({ date: -1 });
    res.json(queries);
  } catch (error) {
    console.error("❌ Error fetching queries:", error);
    res.status(500).json({ message: "Error fetching queries" });
  }
});

// Send Manual Email Reply (Admin)
app.post("/api/send-reply", async (req, res) => {
  try {
    const { email, query, reply } = req.body;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Response to Your Query – IIITDM Support",
      text: `Hello,\n\nRegarding your query: "${query}",\n\nOur Response:\n${reply}\n\nBest Regards,\nIIITDM Support Team`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Reply sent successfully" });
  } catch (error) {
    console.error("❌ Error sending reply:", error);
    res.status(500).json({ message: "Error sending reply" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});