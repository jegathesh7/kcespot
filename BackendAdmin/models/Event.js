const mongoose = require("mongoose");


const eventSchema = new mongoose.Schema(
  {
    title: String,
    startDate: Date,
    endDate: Date,
    campus: String,
    venue: String,
    mode: String,
    organizer: String,
    type: String,
    visibility: String,
    targetAudience: String,
    status: Boolean,
    eventDate: Date,
  },
  { timestamps: true } 
);


module.exports = mongoose.model("Event", eventSchema);