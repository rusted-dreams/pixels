import React from "react";
import Sidebar from "./components/ui/Sidebar";
import ImageUpload from "./components/ui/ImageUpload";
import ProcessedImage from "./components/ui/ProcessedImage";
import "./App.css";

function App() {
  return (
    <div className="h-screen w-screen flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/5 bg-gray-100 border-r p-4">
        <Sidebar />
      </div>

      {/* Original Image Upload */}
      <div className="w-3/5 p-4 flex items-center justify-center bg-white">
        <ImageUpload />
      </div>

      {/* Processed Output */}
      <div className="w-1/5 bg-gray-50 border-l p-4">
        <ProcessedImage />
      </div>
    </div>
  );
}

export default App;
