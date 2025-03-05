import Link from 'next/link';
import Navbar from './components/Navbar';

export default function Home() {
  return (
    <>
    <Navbar/>
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="text-center max-w-2xl px-4">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          Dark Store Network Projector
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          Optimize your retail strategy with AI-powered location predictions and demand forecasting
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/predict">
            <button className="px-8 py-3 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg 
              font-semibold text-lg transition-all duration-200 shadow-sm hover:shadow-md
              border border-blue-200">
              📍 Predict Location
            </button>
          </Link>
          
          <Link href="/demand">
            <button className="px-8 py-3 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg 
              font-semibold text-lg transition-all duration-200 shadow-sm hover:shadow-md
              border border-green-200">
              📈 Demand Forecast
            </button>
          </Link>
        </div>

        <div className="mt-12 flex gap-6 justify-center text-gray-500">
          <Link href="/about" className="hover:text-gray-700 transition">
            How it works
          </Link>
          <Link href="/cases" className="hover:text-gray-700 transition">
            Case studies
          </Link>
          <Link href="/contact" className="hover:text-gray-700 transition">
            Contact
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}