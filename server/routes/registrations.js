const express = require("express");
const Registration = require("../models/Registration");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, college, year, events } = req.body;
    if (!name || !email || !phone || !college || !year)
      return res.status(400).json({ message: "Fill in all required fields." });
    if (!/^\S+@\S+\.\S+$/.test(email))
      return res.status(400).json({ message: "Enter a valid email address." });
    if (!/^[6-9]\d{9}$/.test(phone))
      return res.status(400).json({ message: "Enter a valid 10-digit phone number." });
    await Registration.create({ name, email, phone, college, year, events: Array.isArray(events) ? events : [] });
    res.status(201).json({ message: "You're registered." });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: "This email is already registered." });
    console.error(err);
    res.status(500).json({ message: "Server error. Try again in a moment." });
  }
});

router.get("/", async (req, res) => {
  if (!process.env.ADMIN_KEY || req.header("x-admin-key") !== process.env.ADMIN_KEY)
    return res.status(401).json({ message: "Wrong admin key." });
  res.json(await Registration.find().sort({ createdAt: -1 }));
});

module.exports = router;
