const mongoose = require("mongoose");

const redemptionSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rewardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RewardCatalog",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "fulfilled", "cancelled"],
      default: "pending",
    },
    redeemedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Redemption", redemptionSchema);
