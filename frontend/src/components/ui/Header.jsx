import React, { useState } from "react";
import { Sun, UserCircle2 } from "lucide-react";

function Header() {
  const [showAboutModal, setShowAboutModal] = useState(false);

  return (
    <>
      <header className="w-full h-18 bg-gray-200 border-b shadow-md flex items-center justify-between px-6">
        {/* Left: Hamburger + Logo */}
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold text-gray-800">Pixels</h1>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center space-x-6">
          <button 
            onClick={() => setShowAboutModal(true)}
            className="text-gray-600 hover:text-gray-800 font-medium text-sm"
          >
            About Us
          </button>
          <Sun className="w-5 h-5 text-gray-600 cursor-pointer hover:text-yellow-500" />
          <UserCircle2 className="w-7 h-7 text-gray-600 cursor-pointer hover:text-gray-800" />
        </div>
      </header>

      {/* About Modal */}
      {showAboutModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowAboutModal(false)}
        >
          <div 
            className="bg-white p-6 rounded-lg max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4">About Pixels</h2>
            <p className="mb-3">
              Pixels is a learning tool for students studying image and video processing using machine learning.
            </p>
            <p className="mb-3">
              Test your models' outputs against reference implementations or explore what different methods
              do to an image when applied - all essential image processing methods under one roof.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowAboutModal(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;