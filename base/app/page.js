import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
      <h1 className="text-4xl font-extrabold tracking-wide">Dark Store Location Predictor</h1>

      <p className="mt-3 text-gray-400 text-lg">Find the best locations & forecast demand efficiently.</p>

      <div className="mt-8 flex space-x-6">
        <Link href="/predict">
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg shadow-md transition">
            Predict Location
          </button>
        </Link>
        <Link href="/demand">
          <button className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-medium rounded-lg shadow-md transition">
            Demand Forecast
          </button>
        </Link>
      </div>
    </div>
  );
}
