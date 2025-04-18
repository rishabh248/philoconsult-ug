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
app.use(cors({ origin: "https://philoconsult-ug.onrender.com" }));
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
    user: process.env.EMAIL_USER, // rishabhc0026@gmail.com
    pass: process.env.EMAIL_PASS, // ojpkxcwcwonropnj
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
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <img src="https://philoconsult-ug.onrender.com/logo.png" alt="PhiloConsult Logo" style="width: 150px; margin-bottom: 20px;" />
          <h2>Hello ${name},</h2>
          <p>Thank you for reaching out to PhiloConsult!</p>
          <p>We have received your query:</p>
          <blockquote style="border-left: 2px solid #bb86fc; padding-left: 10px;">${query}</blockquote>
          <p>Our team will get back to you soon. In the meantime, feel free to explore our services at <a href="https://philoconsult-ug.onrender.com">PhiloConsult</a>.</p>
          <p>Best Regards,<br>PhiloConsult Team</p>
          <hr />
          <p style="font-size: 12px; color: #666;">
            <a href="https://philoconsult-ug.onrender.com/unsubscribe">Unsubscribe</a> | 
            <a href="https://philoconsult-ug.onrender.com/privacy">Privacy Policy</a>
          </p>
        </div>
      `,
      list: {
        unsubscribe: {
          url: 'https://philoconsult-ug.onrender.com/unsubscribe',
          comment: 'Unsubscribe from PhiloConsult emails'
        }
      }
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
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <img src="https://philoconsult-ug.onrender.com/logo.png" alt="PhiloConsult Logo" style="width: 150px; margin-bottom: 20px;" />
          <h2>Hello,</h2>
          <p>Regarding your query:</p>
          <blockquote style="border-left: 2px solid #bb86fc; padding-left: 10px;">${query}</blockquote>
          <p>Our Response:</p>
          <p>${reply}</p>
          <p>Best Regards,<br>PhiloConsult Team</p>
          <hr />
          <p style="font-size: 12px; color: #666;">
            <a href="https://philoconsult-ug.onrender.com/unsubscribe">Unsubscribe</a> | 
            <a href="https://philoconsult-ug.onrender.com/privacy">Privacy Policy</a>
          </p>
        </div>
      `,
      list: {
        unsubscribe: {
          url: 'https://philoconsult-ug.onrender.com/unsubscribe',
          comment: 'Unsubscribe from PhiloConsult emails'
        }
      }
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Reply sent successfully" });
  } catch (error) {
    console.error("❌ Error sending reply:", error);
    res.status(500).json({ message: "Error sending reply" });
  }
});

// Unsubscribe Endpoint (Dummy for now)
app.post("/unsubscribe", async (req, res) => {
  console.log("Unsubscribe request received");
  res.status(200).json({ message: "Unsubscribed successfully!" });
});

// Start Server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});