require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/registrations", require("./routes/registrations"));

const port = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => app.listen(port, () => console.log("Server running on port " + port)))
  .catch((err) => { console.error("MongoDB connection failed:", err.message); process.exit(1); });
