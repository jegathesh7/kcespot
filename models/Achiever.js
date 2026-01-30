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
    college: String,
    batch: String,
    category: String,
    description: String,
    status: Boolean,
    eventDate: Date,
    posterImage: String,
    students: [studentSchema],
    reactions: {
        like: { type: Number, default: 0 },
        heart: { type: Number, default: 0 },
        clap: { type: Number, default: 0 },
        fire: { type: Number, default: 0 }
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Achiever", achieverSchema);
