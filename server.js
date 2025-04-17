const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
require("dotenv").config();
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" })); // Allow all origins for simplicity, update to specific URL for production
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 50000,
  })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Schema & Model
const querySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  query: { type: String, required: true },
  category: { type: String },
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

// Submit Query
app.post("/api/submit-query", async (req, res) => {
  console.log("Received Query:", req.body);
  const { name, email, query, category } = req.body;
  try {
    if (!name || !email || !query) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const newQuery = new Query({ name, email, query, category });
    await newQuery.save();
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Thank you for your query, ${name}!`,
      text: `Hello ${name},\n\nWe received your query:\n"${query}"\n\nYou will get a reply soon.\n\nBest Regards,\nPhiloConsult Team`,
    };
    await transporter.sendMail(mailOptions)
      .then(() => console.log("✅ Email sent successfully"))
      .catch((emailErr) => console.error("❌ Email Error:", emailErr));
    res.status(200).json({ message: "Query submitted successfully!" });
  } catch (err) {
    console.error("❌ Error in /api/submit-query:", err.stack);
    res.status(500).json({ message: "An error occurred.", error: err.message });
  }
});

// Get All Queries (Admin Panel)
app.get("/get-queries", async (req, res) => {
  try {
    const queries = await Query.find().sort({ date: -1 });
    res.json(queries);
  } catch (error) {
    console.error("❌ Error fetching queries:", error);
    res.status(500).json({ message: "Error fetching queries" });
  }
});

// Send Manual Email Reply (Admin)
app.post("/send-reply", async (req, res) => {
  try {
    const { email, query, reply } = req.body;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Response to Your Query – PhiloConsult",
      text: `Hello,\n\nRegarding your query: "${query}",\n\nOur Response:\n${reply}\n\nBest Regards,\nPhiloConsult Team`,
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Reply sent successfully" });
  } catch (error) {
    console.error("❌ Error sending reply:", error);
    res.status(500).json({ message: "Error sending reply" });
  }
});

// Start Server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});