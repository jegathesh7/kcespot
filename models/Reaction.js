const mongoose = require("mongoose");

const reactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    achiever: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Achiever",
      required: true,
    },
    type: {
      type: String,
      enum: ["r1", "r2", "r3", "r4", "r5"],
      required: true,
    },
  },
  { timestamps: true },
);

// Compound index to ensure one reaction per user per post
reactionSchema.index({ user: 1, achiever: 1 }, { unique: true });

module.exports = mongoose.model("Reaction", reactionSchema);
