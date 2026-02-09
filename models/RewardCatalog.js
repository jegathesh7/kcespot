const mongoose = require("mongoose");

const rewardCatalogSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    pointsCost: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    category: {
      type: String,
      enum: ["Merchandise", "Privilege", "Digital", "Recognition"],
      required: true,
    },
    expiryDate: { type: Date },
    imageUrl: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("RewardCatalog", rewardCatalogSchema);
