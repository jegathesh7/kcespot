const mongoose = require("mongoose");

const pointRuleSchema = new mongoose.Schema(
  {
    category: { type: String, required: true, unique: true },
    points: { type: Number, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("PointRule", pointRuleSchema);
