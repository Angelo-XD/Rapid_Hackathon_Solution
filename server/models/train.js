const mongoose = require("mongoose");

const stopSchema = new mongoose.Schema({
  station: {
    type: String,
    required: true,
    trim: true,
  },
  distanceFromPrev: {
    type: Number, // in KM
    required: true,
    min: 0,
  },
  departureTime: {
    type: String, // "HH:mm" format
    required: true,
  },
});

const trainSchema = new mongoose.Schema(
  {
    trainName: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    source: {
      type: String,
      required: true,
      trim: true,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
    },
    departureTime: {
      type: String,
      required: true,
      trim: true,
    },
    arrivalTime: {
      type: String,
      required: true,
      trim: true,
    },
    distance: {
      type: Number,
      required: true,
      min: 0,
    },
    stops: {
      type: [stopSchema],
      default: undefined,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Train", trainSchema);
