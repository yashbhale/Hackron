'use client'

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const PredictedDarkStores = () => {
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const storedData = JSON.parse(localStorage.getItem("resultareas"));
      setResult(storedData?.insights || []);
      console.log(storedData?.insights);
      setLoading(false);
    }, 1000); // Simulating delay for better UX
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">
              Predicted Dark Stores Locations
            </h1>
            <p className="text-gray-600">
              Optimized locations based on market analysis
            </p>
          </header>

          {loading ? (
            <div className="text-center text-xl font-semibold text-gray-700">
              Loading...
            </div>
          ) : result.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {result.map((region, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-gray-800">
                        {region.name}
                      </h2>
                      <span className={`px-3 py-1 rounded-full text-sm ${region.size === 'Large'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                        }`}>
                        {region.size}
                      </span>
                    </div>

                    <div className="space-y-3 text-gray-600">
                      <div className="flex items-center">
                        <span className="mr-2">🌐</span>
                        {region.area} Area
                      </div>

                      <div className="flex items-center">
                        <span className="mr-2">📍</span>
                        {region.latitude}, {region.longitude}
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-500">Rental Cost</div>
                          <div className="font-semibold text-blue-600">
                            {region.rentalcost}
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-500">Travel Cost</div>
                          <div className="font-semibold text-green-600">
                            {region.travelingcost}
                          </div>
                        </div>
                      </div>
                    </div>

                    <button className="mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-xl font-semibold text-gray-500">
              No data available.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PredictedDarkStores;
