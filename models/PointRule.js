const mongoose = require("mongoose");
const { ACHIEVEMENT_CATEGORIES } = require("../config/constants");

const pointRuleSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      unique: true,
      enum: ACHIEVEMENT_CATEGORIES,
    },
    points: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("PointRule", pointRuleSchema);
