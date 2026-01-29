const mongoose = require("mongoose");


const studentSchema = new mongoose.Schema({
  name: String,
  year: String,
  dept: String,
  imageUrl: String,
});


const achieverSchema = new mongoose.Schema(
  {
    name: String,
    batch: String,
    category: String,
    description: String,
    status: Boolean,
    eventDate: Date,
    posterImage: String,
    students: [studentSchema],
  },
  { timestamps: true }
);


module.exports = mongoose.model("Achiever", achieverSchema);
