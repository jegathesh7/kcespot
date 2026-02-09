const mongoose = require("mongoose");

const achievementSubmissionSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    evidenceUrl: { type: String }, // External link (optional)
    evidenceImage: { type: String }, // Uploaded file path
    evidenceHash: { type: String, unique: true }, // For duplicate detection

    collegeName: { type: String },
    department: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "resubmit"],
      default: "pending",
    },
    pointsAwarded: { type: Number, default: 0 },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
    rejectionReason: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model(
  "AchievementSubmission",
  achievementSubmissionSchema,
);
