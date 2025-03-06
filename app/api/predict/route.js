import mongoose from "mongoose";

const MONGO_URI = "mongodb+srv://yashvivekbhale:Yash12345@cluster0.hbyhn.mongodb.net/?authMechanism=DEFAULT";

// Ensure MongoDB connects properly
if (mongoose.connection.readyState === 0) {
  mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));
}

// Caching geolocation responses
const locationCache = new Map();

async function getAreaName(latitude, longitude) {
  const cacheKey = `${latitude},${longitude}`;
  if (locationCache.has(cacheKey)) {
    return locationCache.get(cacheKey);
  }

  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
    const data = await response.json();
    const areaName = data.display_name || "Unknown";
    locationCache.set(cacheKey, areaName); // Cache result
    return areaName;
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

    // Fetch city coordinates
    const cityResponse = await fetch(`https://nominatim.openstreetmap.org/search?q=${city}&format=json&limit=1`);
    const cityData = await cityResponse.json();
    if (!Array.isArray(cityData) || cityData.length === 0) {
      return new Response(JSON.stringify({ error: "City not found" }), { status: 404 });
    }
    const { lat, lon } = cityData[0];

    // Fetch cluster data
    let clusterResponse;
    try {
      clusterResponse = await fetch("https://hackron-2.onrender.com/api/cluster");
      if (!clusterResponse.ok) throw new Error(`Cluster API failed with status ${clusterResponse.status}`);
    } catch (err) {
      console.error("Cluster API Error:", err);
      return new Response(JSON.stringify({ error: "Failed to fetch cluster data" }), { status: 500 });
    }

    const { cluster_centers } = await clusterResponse.json();
    if (!Array.isArray(cluster_centers)) {
      return new Response(JSON.stringify({ error: "Invalid cluster data received" }), { status: 500 });
    }

    // Process cluster data with geolocation caching
    const clusterInsights = await Promise.all(cluster_centers.map(async (coords, index) => {
      const areaName = await getAreaName(coords[0], coords[1]);

      let avg_rental_expenditure = "N/A";
      try {
        const rentResponse = await fetch("https://hackron-2.onrender.com/api/expenditure", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ latitude: coords[0], longitude: coords[1] }),
        });

        if (rentResponse.ok) {
          const rentData = await rentResponse.json();
          avg_rental_expenditure = rentData.avg_rental_expenditure;
        } else {
          console.error(`Rent API failed with status ${rentResponse.status}`);
        }
      } catch (err) {
        console.error("Rent API Error:", err);
      }

      return {
        id: index + 5,
        rentalcost: avg_rental_expenditure,
        travelingcost: 10000,
        latitude: coords[0],
        longitude: coords[1],
        name: areaName,
        size: "Cluster Point",
      };
    }));

    return new Response(JSON.stringify({ city, insights: clusterInsights }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error fetching data:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
