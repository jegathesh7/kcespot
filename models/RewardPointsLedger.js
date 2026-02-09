const mongoose = require("mongoose");

const rewardPointsLedgerSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, required: true },
    type: {
      type: String,
      enum: ["credit", "debit", "reset"],
      required: true,
    },
    reason: { type: String, required: true },
    referenceId: { type: mongoose.Schema.Types.ObjectId }, // Link to Submission, Redemption, etc.
    referenceModel: { type: String }, // Model name for referenceId
  },
  { timestamps: true },
);

module.exports = mongoose.model("RewardPointsLedger", rewardPointsLedgerSchema);
