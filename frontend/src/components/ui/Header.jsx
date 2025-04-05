import React from "react";
import { Sun, HelpCircle, UserCircle2 } from "lucide-react"; // Make sure lucide-react is installed

function Header() {
  return (
    <header className="w-full h-18 bg-gray-200 border-b shadow-md flex items-center justify-between px-6">
      {/* Left: Logo only */}
      <div className="flex items-center">
        <h1 className="text-3xl font-bold text-gray-800">Pixels</h1>
      </div>

      {/* Right: Icons */}
      <div className="flex items-center space-x-6">
        <HelpCircle className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" />
        <Sun className="w-5 h-5 text-gray-600 cursor-pointer hover:text-yellow-500" />
        <UserCircle2 className="w-7 h-7 text-gray-600 cursor-pointer hover:text-gray-800" />
      </div>
    </header>
  );
}

export default Header;
