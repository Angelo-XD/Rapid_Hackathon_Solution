// routes/trainRoutes.js
const express = require("express");
const router = express.Router();
const trainController = require("../controllers/train.controller");

// Add a new train
router.post("/", trainController.addTrain);

// Get all trains
router.get("/", trainController.getAllTrains);

// Search for trains between two stations
// Example: /api/trains/search?source=Bangalore&destination=Mangalore&sortBy=price
router.get("/search", trainController.searchTrains);

module.exports = router;
