const mongoose = require("mongoose");


const eventSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
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
    eventImage: String,
  },
  { timestamps: true } 
);


module.exports = mongoose.model("Event", eventSchema);