const mongoose = require("mongoose");

const badgeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    pointsRequired: { type: Number, required: true },
    iconUrl: { type: String },
    description: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Badge", badgeSchema);
