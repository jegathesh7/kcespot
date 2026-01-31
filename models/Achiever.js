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
        r1: { type: Number, default: 0 },
        r2: { type: Number, default: 0 },
        r3: { type: Number, default: 0 },
        r4: { type: Number, default: 0 },
        r5:{type:Number,default:0}
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Achiever", achieverSchema);
