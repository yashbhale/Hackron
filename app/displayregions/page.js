"use client";
import React, { useEffect, useState } from "react";
import { 
  MapPin, 
  Building2, 
  DollarSign, 
  Car,
  Loader2,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import Navbar from "../components/Navbar";

function App() {
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      const storedData = JSON.parse(localStorage.getItem("resultareas"));
      setResult(storedData?.insights || []);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Building2 className="h-6 w-6 text-blue-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">DarkStore Analytics</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Predicted Dark Store Locations
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            AI-powered location recommendations based on comprehensive market analysis, 
            demographics, and logistics optimization.
          </p>
        </header>

        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              <p className="text-gray-600 font-medium">Analyzing locations...</p>
            </div>
          </div>
        ) : result.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {result.map((region, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"
              >
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                      {region.name}
                    </h2>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        region.size === "Large"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {region.size}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center text-gray-700">
                      <MapPin className="h-5 w-5 mr-3 text-blue-600" />
                      <span>{region.area} Area</span>
                    </div>

                    <div className="flex items-center text-gray-700">
                      <Building2 className="h-5 w-5 mr-3 text-blue-600" />
                      <span>
                        {region.latitude}, {region.longitude}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="flex items-center mb-2">
                        <DollarSign className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-gray-600 ml-1">Rental</span>
                      </div>
                      <div className="font-semibold text-blue-600">
                        {region.rentalcost}
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="flex items-center mb-2">
                        <Car className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm text-gray-600 ml-1">Travel</span>
                      </div>
                      <div className="font-semibold text-emerald-600">
                        {region.travelingcost}
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setSelectedRegion(region)}
                    className="mt-auto w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
                  >
                    View Analysis
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
            <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-xl font-semibold">No location data available</p>
            <p className="mt-2">Please run the analysis to see recommendations</p>
          </div>
        )}
      </main>
    </div>
    </>
  );
}

export default App;