import React from "react";
import Sidebar from "./components/ui/Sidebar";
import ImageUpload from "./components/ui/ImageUpload";
import ProcessedImage from "./components/ui/ProcessedImage";
import Header from "./components/ui/Header";
import "./App.css";

function App() {
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-1/5 min-w-[200px] bg-gray-100 border-r p-4">
          <Sidebar />
        </div>

        {/* Image Upload */}
        <div className="flex-1 p-4 flex items-center justify-center bg-white overflow-auto">
          <ImageUpload />
        </div>

        {/* Processed Output */}
        <div className="w-1/5 min-w-[200px] bg-gray-50 border-l p-4">
          <ProcessedImage />
        </div>
      </div>
    </div>
  );
}

export default App;
