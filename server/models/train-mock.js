const mongoose = require("mongoose");

const trainSchema = new mongoose.Schema(
  {
    trainName: { type: String, required: true },
    departureTime: { type: String, required: true },
    arrivalTime: { type: String, required: true },
    distance: { type: Number, required: true },
    source: { type: String, required: true },
    destination: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Train", trainSchema);
