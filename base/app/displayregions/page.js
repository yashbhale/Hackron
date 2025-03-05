import React from "react";
import Navbar from "../components/Navbar";

const regions = [
  {
    name: "Koregaon Park",
    area: "3.5 sq km",
    size: "Medium",
    latitude: 18.5362,
    longitude: 73.8936,
    rentalCost: "₹40,000",
    travelingCost: "₹5,000",
  },
  {
    name: "Baner",
    area: "6.2 sq km",
    size: "Large",
    latitude: 18.559,
    longitude: 73.7797,
    rentalCost: "₹35,000",
    travelingCost: "₹4,500",
  },
  {
    name: "Hinjewadi",
    area: "8.5 sq km",
    size: "Large",
    latitude: 18.5979,
    longitude: 73.7186,
    rentalCost: "₹25,000",
    travelingCost: "₹6,000",
  },
  {
    name: "Hadapsar",
    area: "5.8 sq km",
    size: "Medium",
    latitude: 18.5087,
    longitude: 73.9275,
    rentalCost: "₹30,000",
    travelingCost: "₹5,500",
  },
  {
    name: "Wakad",
    area: "7.3 sq km",
    size: "Medium",
    latitude: 18.5982,
    longitude: 73.7551,
    rentalCost: "₹28,000",
    travelingCost: "₹4,800",
  },
];



const PredictedDarkStores = () => {
  return (
    <>
    <Navbar/>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regions.map((region, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    {region.name}
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    region.size === 'Large' 
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
                        {region.rentalCost}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-500">Travel Cost</div>
                      <div className="font-semibold text-green-600">
                        {region.travelingCost}
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
      </div>
    </div>
    </>
  );
};

export default PredictedDarkStores;