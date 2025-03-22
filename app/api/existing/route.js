import axios from "axios";
import mongoose from "mongoose";

if (!mongoose.connections[0].readyState) {
  mongoose.connect(`${process.env.Mongo}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));
}

async function getAreaName(latitude, longitude) {
  try {
    const response = await axios.get("https://nominatim.openstreetmap.org/reverse", {
      params: { lat: latitude, lon: longitude, format: "json" },
    });

    return response.data.display_name || "Unknown";
  } catch (error) {
    console.error("Reverse Geocoding Error:", error);
    return "Unknown";
  }
}

export async function POST(req) {
  try {
    const { city } = await req.json();

    if (!city) {
      return new Response(JSON.stringify({ error: "City name is required" }), { status: 400 });
    }

    const cityResponse = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: { q: city, format: "json", limit: 1 },
    });

    if (cityResponse.data.length === 0) {
      return new Response(JSON.stringify({ error: "City not found" }), { status: 404 });
    }

    const { lat, lon } = cityResponse.data[0];

    // Fetch cluster data from Flask API
    const clusterResponse = await axios.get("https://hackron-production.up.railway.app/api/cluster");
    const clusterCenters = clusterResponse.data.cluster_centers;

    // Get area names for cluster points
    const clusterInsights = await Promise.all(clusterCenters.map(async (coords, index) => {
      const areaName = await getAreaName(coords[0], coords[1]);
      return {
        id: index + 5, // IDs start after demo data
        rentalcost: 150000,
        travelingcost:10000,
        latitude: coords[0],
        longitude: coords[1],
        name: areaName,
        size: "Cluster Point",
      };
    }));

    return new Response(JSON.stringify({
      city,
      insights: [
        ...clusterInsights, // Adding dynamic cluster locations
      ],
    }), { status: 200, headers: { "Content-Type": "application/json" } });

  } catch (error) {
    console.error("Error fetching data:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
