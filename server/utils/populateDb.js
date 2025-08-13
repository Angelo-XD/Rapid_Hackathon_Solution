require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://221201010:angieangelo@rapidtrainscluster.txzdz7f.mongodb.net/?retryWrites=true&w=majority&appName=rapidtrainscluster";
const TRAINS_JSON_PATH = path.join(
  __dirname,
  "../trains_with_source_destination.json"
);

async function dropCodeIndex(collection) {
  try {
    await collection.dropIndex("code_1");
    console.log("✅ Dropped index 'code_1' from trains collection.");
  } catch (err) {
    if (err.codeName === "IndexNotFound") {
      console.log("ℹ️ Index 'code_1' not found, nothing to drop.");
    } else {
      console.error("❌ Error dropping index:", err.message);
    }
  }
}

async function populateTrains() {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const collection = mongoose.connection.collection("trains");

  // Drop code index if exists
  await dropCodeIndex(collection);

  // Clear existing trains
  await collection.deleteMany({});
  console.log("✅ Existing train data cleared");

  // Read train data
  const trainsData = JSON.parse(fs.readFileSync(TRAINS_JSON_PATH, "utf-8"));

  // Insert trains
  const result = await collection.insertMany(trainsData);
  console.log(`✅ Inserted ${result.insertedCount} trains.`);

  await mongoose.disconnect();
  console.log("🚀 DB population complete!");
}

populateTrains().catch((err) => {
  console.error("❌ Error populating DB:", err);
  process.exit(1);
});
