const mongoose = require("mongoose");

const semesterConfigSchema = new mongoose.Schema(
  {
    collegeName: { type: String, required: true },
    batch: { type: String, required: true },
    semester: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("SemesterConfig", semesterConfigSchema);
