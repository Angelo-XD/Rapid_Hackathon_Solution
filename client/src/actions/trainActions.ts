import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/trains";

export interface Station {
  id: string;
  name: string;
}

export const getStations = async (): Promise<Station[]> => {
  const res = await axios.get<Station[]>(`${API_BASE_URL}`);
  return res.data;
};

export interface Train {
  id: string;
  name: string;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  seatsAvailable: number;
  price: number;
}

export const searchTrains = async (
  source: string,
  destination: string,
  sortBy?: string
): Promise<Train[]> => {
  const res = await axios.get<Train[]>(`${API_BASE_URL}/search`, {
    params: { source, destination, sortBy },
  });
  console.log("🚀 Train search complete!");
  console.log(res.data);
  return res.data;
};

export const fetchAllTrains = async () => {
  const res = await axios.get(`${API_BASE_URL}`);
  console.log("🚀 Fetched all trains:");
  console.log(res.data.data);
  return res.data.data;
};

export const fetchAllStations = async () => {
  const res = await axios.get(`${API_BASE_URL}`);
  // Collect all unique stations from all trains' stops
  const trains = res.data.data;
  const stationSet = new Set<string>();
  trains.forEach((train: any) => {
    if (Array.isArray(train.stops) && train.stops.length > 0) {
      train.stops.forEach((stop: any) => {
        if (
          stop.station &&
          typeof stop.station === "string" &&
          stop.station.trim() !== ""
        ) {
          stationSet.add(stop.station.trim());
        }
      });
    }
    // Fallback: add source and destination if stops are missing
    if (!train.stops || train.stops.length === 0) {
      if (
        train.source &&
        typeof train.source === "string" &&
        train.source.trim() !== ""
      ) {
        stationSet.add(train.source.trim());
      }
      if (
        train.destination &&
        typeof train.destination === "string" &&
        train.destination.trim() !== ""
      ) {
        stationSet.add(train.destination.trim());
      }
    }
  });
  return Array.from(stationSet).sort((a, b) => a.localeCompare(b));
};
