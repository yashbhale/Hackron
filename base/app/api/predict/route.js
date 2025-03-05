import axios from "axios";
import mongoose from "mongoose";

// Connect to MongoDB only if not already connected
if (!mongoose.connections[0].readyState) {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));
}

// Fix API Route Export
export async function POST(req) {
  try {
    const { city } = await req.json();

    if (!city) {
      return new Response(JSON.stringify({ error: "City name is required" }), { status: 400 });
    }

    // Fetch latitude & longitude from OpenStreetMap Nominatim API
    const response = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: { q: city, format: "json", limit: 1 },
    });

    if (response.data.length === 0) {
      return new Response(JSON.stringify({ error: "City not found" }), { status: 404 });
    }

    const { lat, lon } = response.data[0];

    return new Response(JSON.stringify({
      city,
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),
      best_locations: ["Area A", "Area B", "Area C"], // Replace with actual logic
    }), { status: 200, headers: { "Content-Type": "application/json" } });

  } catch (error) {
    console.error("Error fetching location:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
