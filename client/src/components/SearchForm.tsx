import React, { useState } from "react";
import Dropdown from "./Dropdown";
import TrainList from "./TrainList";
import { motion } from "framer-motion";
import {
  fetchAllTrains,
  fetchAllStations,
  searchTrains,
} from "../actions/trainActions";

const SearchForm = () => {
  const [source, setSource] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [stations, setStations] = useState<string[]>([]);
  const [trains, setTrains] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [showStations, setShowStations] = useState(false);

  // Fetch stations on demand
  const handleShowStations = async () => {
    const stationList = await fetchAllStations();
    setStations(stationList);
    setShowStations(true);
    setTrains([]);
  };

  // Fetch all trains on demand
  const handleShowAllTrains = async () => {
    const allTrains = await fetchAllTrains();
    setTrains(Array.isArray(allTrains) ? allTrains : []);
    setShowStations(false);
  };

  // Search trains between two locations
  const handleSearch = async () => {
    if (!source || !destination) {
      setError("Please select both source and destination.");
      return;
    }
    if (source === destination) {
      setError("Source and destination cannot be the same.");
      return;
    }
    setError("");
    const { data } = await searchTrains(source, destination);
    console.log("Search results:", data);
    await setTrains(Array.isArray(data) ? data : []);
    setShowStations(false);
  };

  // Fetch stations for dropdowns on mount
  React.useEffect(() => {
    (async () => {
      const stationList = await fetchAllStations();
      setStations(stationList);
    })();
  }, []);

  // Helper to disable option if selected in other dropdown
  const getDropdownOptions = (type: "source" | "destination") => {
    return stations.map((station) => ({
      value: station,
      label: station,
      disabled:
        (type === "source" && station === destination) ||
        (type === "destination" && station === source),
    }));
  };

  return (
    <div className="p-8 max-w-xl mx-auto bg-white rounded-xl shadow-lg flex flex-col gap-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-center mb-2 text-blue-700">
        Train Search
      </h2>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "#2563eb" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShowAllTrains}
            className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition"
          >
            Show All Trains
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "#2563eb" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShowStations}
            className="bg-purple-500 text-white px-4 py-2 rounded shadow hover:bg-purple-600 transition"
          >
            Show All Stations
          </motion.button>
        </div>

        <div className="flex flex-1 gap-x-5 justify-between">
          <Dropdown
            label="Source"
            options={getDropdownOptions("source")}
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
          <Dropdown
            label="Destination"
            options={getDropdownOptions("destination")}
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: "#2563eb" }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSearch}
          className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-600 transition-all duration-200"
        >
          Search Trains
        </motion.button>
      </div>

      {error && (
        <p className="text-red-500 mb-2 text-center font-medium">{error}</p>
      )}

      <div className="mt-6">
        {showStations && (
          <div>
            <h3 className="text-lg font-bold mb-2 text-purple-700">
              All Stations
            </h3>
            <ul className="list-disc pl-6">
              {stations.map((station) => (
                <li key={station}>{station}</li>
              ))}
            </ul>
          </div>
        )}
        {trains.length > 0 && <TrainList trains={trains} />}
      </div>
    </div>
  );
};

export default SearchForm;
