"use client";

import Link from 'next/link';
import Navbar from './components/Navbar';
import Image from 'next/image';

export default function Home() {
  const features = [
    { title: "AI-Powered Demand Forecasting", icon: "📈", description: "Uses machine learning to predict demand patterns and optimize inventory placement." },
    { title: "Smart Geographical Analysis", icon: "🗺", description: "Identifies high-demand zones and uses heatmaps for strategic location planning." },
    { title: "Optimal Store Placement", icon: "📍", description: "Recommends the best locations to minimize logistics costs and maximize reach." },
    { title: "Interactive Data Visualization", icon: "📊", description: "Provides real-time analytics with maps and graphs for informed decision-making." },
    { title: "Dynamic Business Insights", icon: "💡", description: "Offers actionable recommendations and tracks key performance metrics." },
    { title: "Seamless User Experience", icon: "🌐", description: "Fast, secure, and mobile-friendly platform for accessibility." }
  ];
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col sm:flex-row items-center justify-center bg-gradient-to-r from-blue-50 to-green-50 px-6">
        <div className="text-left max-w-2xl animate-fade-in">
          <h1 className="text-6xl font-extrabold text-gray-900 mb-6 drop-shadow-md">
            Dark Store Network Projector
          </h1>
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            Optimize your retail strategy with AI-powered location predictions and demand forecasting.
          </p>

          <Link href="/predict">
            <button className={`px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg 
              font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer`}>
              📍 Predict Locations
            </button>
          </Link>

          <Link href="/displayregions">
              <button className={`px-8 py-3 ml-4 bg-green-500 hover:bg-green-600 text-white rounded-lg 
                font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer`}>
                📈 Expenditure
              </button>
            </Link>
            
            <Link href="/existing">
              <button className={`px-11 py-3 ml-0 mt-4 bg-green-500 hover:bg-green-600 text-white rounded-lg 
                font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer`}>
                📈 Add new store in existing infrastructure
              </button>
            </Link>
          <div className="mt-12 flex gap-6 text-gray-600 animate-fade-in">
            <Link href="/about" className="hover:text-gray-900 transition font-medium">
              How it works
            </Link>
            <Link href="/cases" className="hover:text-gray-900 transition font-medium">
              Case studies
            </Link>
            <Link href="/contact" className="hover:text-gray-900 transition font-medium">
              Contact
            </Link>
          </div>
        </div>
        
        <div className="mt-10 sm:mt-0 sm:ml-10 animate-slide-up">
          {/* <img src='/delivery-boy.png' alt="Predict Location" width={500} height={500} className="" /> */}
        </div>
      </div>

      <div className="py-24 bg-gray-900 text-white text-center px-6 animate-fade-in">
        <h2 className="text-4xl font-bold mb-8">🌟 Key Features</h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all">
              <h3 className="text-xl font-semibold mb-3">{feature.icon} {feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slideUp 0.8s ease-out;
        }
      `}</style>
    </>
  );
}