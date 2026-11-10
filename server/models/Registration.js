const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    college: { type: String, required: true, trim: true },
    year: { type: String, required: true },
    events: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Registration", schema);
