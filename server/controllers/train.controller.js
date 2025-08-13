// controllers/trainController.js
const Train = require("../models/train");

// Rs per KM constant
const PRICE_PER_KM = 1.25;

// Add a new train
exports.addTrain = async (req, res) => {
  try {
    const train = new Train(req.body);
    await train.save();
    res.status(201).json({ success: true, data: train });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Get all trains
exports.getAllTrains = async (req, res) => {
  try {
    const trains = await Train.find();
    console.log("🚂 All trains fetched successfully");
    res.json({ success: true, data: trains });
  } catch (err) {
    console.error("❌ Error fetching trains:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Search trains between two stations
exports.searchTrains = async (req, res) => {
  try {
    const { source, destination, sortBy } = req.query;
    if (!source || !destination) {
      return res.status(400).json({
        success: false,
        message: "Source and destination are required",
      });
    }

    // Debug logging
    console.log("Searching for source:", source, "destination:", destination);
    // Search using top-level source and destination only
    const trains = await Train.find({ source, destination });
    console.log("Matched trains:", trains);

    let results = trains.map((train) => ({
      source: train.source,
      destination: train.destination,
      trainName: train.trainName || train.name,
      trainCode: train.code,
      startTime: train.departureTime,
      endTime: train.arrivalTime,
      distance: train.distance,
      price: +(train.distance * PRICE_PER_KM).toFixed(2),
    }));

    // Sorting
    if (sortBy === "price") {
      results.sort((a, b) => a.price - b.price);
    } else if (sortBy === "time") {
      results.sort((a, b) => a.startTime.localeCompare(b.startTime));
    }

    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
