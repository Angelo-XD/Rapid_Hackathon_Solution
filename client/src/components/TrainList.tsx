import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Train {
  trainName: string;
  departureTime: string;
  arrivalTime: string;
  source: string;
  destination: string;
  distance: number;
  _id: string;
}

interface TrainListProps {
  trains: Train[];
  sortBy?: string;
}

const sortTrains = (trains: Train[], sortType?: string): Train[] => {
  if (!sortType) return trains;
  const sortedTrains = [...trains];
  const parseTime = (timeStr: string) => {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };
  switch (sortType) {
    case "name-asc":
      sortedTrains.sort((a, b) => a.trainName.localeCompare(b.trainName));
      break;
    case "name-desc":
      sortedTrains.sort((a, b) => b.trainName.localeCompare(a.trainName));
      break;
    case "dep-early":
      sortedTrains.sort(
        (a, b) => parseTime(a.departureTime) - parseTime(b.departureTime)
      );
      break;
    case "dep-late":
      sortedTrains.sort(
        (a, b) => parseTime(b.departureTime) - parseTime(a.departureTime)
      );
      break;
    case "arr-early":
      sortedTrains.sort(
        (a, b) => parseTime(a.arrivalTime) - parseTime(b.arrivalTime)
      );
      break;
    case "arr-late":
      sortedTrains.sort(
        (a, b) => parseTime(b.arrivalTime) - parseTime(a.arrivalTime)
      );
      break;
    case "source-asc":
      sortedTrains.sort((a, b) => a.source.localeCompare(b.source));
      break;
    case "source-desc":
      sortedTrains.sort((a, b) => b.source.localeCompare(a.source));
      break;
    case "dest-asc":
      sortedTrains.sort((a, b) => a.destination.localeCompare(b.destination));
      break;
    case "dest-desc":
      sortedTrains.sort((a, b) => b.destination.localeCompare(a.destination));
      break;
    default:
      break;
  }
  return sortedTrains;
};

const sortOptions = [
  { value: "name-asc", label: "Train Name (A → Z)" },
  { value: "name-desc", label: "Train Name (Z → A)" },
  // { value: "dep-early", label: "Early Departure" },
  // { value: "dep-late", label: "Late Departure" },
  // { value: "arr-early", label: "Early Arrival" },
  // { value: "arr-late", label: "Late Arrival" },
  // { value: "source-asc", label: "Source (A → Z)" },
  // { value: "source-desc", label: "Source (Z → A)" },
  // { value: "dest-asc", label: "Destination (A → Z)" },
  // { value: "dest-desc", label: "Destination (Z → A)" },
];

const TrainList: React.FC<TrainListProps> = ({ trains }) => {
  const [sortBy, setSortBy] = useState<string>("");
  const sortedTrains = sortTrains(trains, sortBy);
  return (
    <div>
      {trains.length > 0 && (
        <div className="mb-4 flex items-center gap-2">
          <label className="font-semibold" htmlFor="sortBy">
            Sort By:
          </label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">None</option>
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}
      <AnimatePresence>
        {sortedTrains.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.3 }}
            className="mt-6 space-y-4"
          >
            {sortedTrains.map((train) => (
              <div
                key={train._id}
                className="p-4 border rounded-lg shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-lg font-bold">{train.trainName}</h3>
                <p>
                  {train.source} → {train.destination}
                </p>
                <p>
                  Departure: {train.startTime} | Arrival: {train.endTime}
                </p>
                <p>Distance: {train.distance} km</p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TrainList;
