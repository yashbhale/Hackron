"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

export default function Predict() {
  const [city, setCity] = useState("");
  const [result, setResult] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [leaflet, setLeaflet] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("leaflet").then((L) => setLeaflet(L));
    }
  }, []);

  const handlePredict = async () => {
    setLoading(true);
    try {
        const res = await fetch("/api/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ city }),
          });

          console.log(res," aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");

          const data = await res.json();
          
      setResult(data);
      setLocation({ lat: data.latitude || 19.076, lng: data.longitude || 72.8777 });
    } catch (error) {
      console.error("Error fetching location:", error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col">
      <div className="p-8 bg-gray-800 shadow-lg">
        <h1 className="text-4xl font-extrabold text-white text-center">
          Predict Best Dark Store Location
        </h1>
        <div className="flex items-center gap-4 mt-6 max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Enter City"
            className="flex-1 p-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button
            onClick={handlePredict}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            disabled={loading}
          >
            {loading ? "Loading..." : "Predict"}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-8 p-8">
        {result && (
          <div className="w-full lg:w-1/3 bg-gray-700 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-white mb-4">Prediction Result:</h2>
            <p className="text-lg text-gray-300">City: <span className="font-bold">{result.city}</span></p>
            <p className="text-lg text-gray-300">Latitude: <span className="font-bold">{result.latitude}</span></p>
            <p className="text-lg text-gray-300">Longitude: <span className="font-bold">{result.longitude}</span></p>
            <h3 className="text-xl font-semibold text-white mt-4">Best Locations:</h3>
            <ul className="mt-2 space-y-3">
              {result.best_locations.map((area, index) => (
                <li key={index} className="bg-gray-600 p-3 rounded-lg flex justify-between items-center">
                  <span className="text-white">{area}</span>
                  <button
                    onClick={() => alert(`Fetching insights for ${area}...`)}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white text-sm font-medium rounded-lg"
                  >
                    View Insights
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {location && leaflet && (
          <div className="flex-1 h-[500px] lg:h-auto rounded-lg overflow-hidden shadow-lg">
            <OptimizedMap location={location} leaflet={leaflet} />
          </div>
        )}
      </div>
    </div>
  );
}

const OptimizedMap = ({ location, leaflet }) => {
  const customIcon = new leaflet.Icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41],
  });

  return (
    <MapContainer center={[location.lat, location.lng]} zoom={12} className="h-full w-full">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[location.lat, location.lng]} icon={customIcon}>
        <Popup className="text-sm font-semibold">
          Predicted Location: {location.lat}, {location.lng}
        </Popup>
      </Marker>
    </MapContainer>
  );
};