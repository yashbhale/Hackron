import React from "react";
import { MapPin, Search, User, Menu } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-gray-100 text-black shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold">blinkit</span>
            </div>
            
            {/* Location Selector */}
            <div className="ml-6 flex items-center space-x-1 cursor-pointer hover:bg-green-700 px-3 py-2 rounded">
              <MapPin className="h-5 w-5" />
              <span className="text-sm font-medium">Pune</span>
              <span className="text-xs mt-0.5">▼</span>
            </div>
          </div>

          {/* Center Section - Search Bar */}
          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative text-gray-600">
              <div className="flex items-center">
                <Search className="absolute left-3 h-5 w-5 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search for regions..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                />
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-4">
              <a href="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700">
                Home
              </a>
              <a href="/city" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700">
                City
              </a>
              <a href="/regions" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700">
                Regions
              </a>
            </div>

            {/* Login/Signup */}
            <button className="flex items-center space-x-1 hover:bg-green-700 px-3 py-2 rounded">
              <User className="h-5 w-5" />
              <span className="text-sm font-medium"></span>
            </button>

            {/* Mobile Menu Button */}
            <button className="md:hidden hover:bg-green-700 p-2 rounded">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
