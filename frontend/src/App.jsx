import React, { useState } from "react";
import Sidebar from "./components/ui/Sidebar";
import ImageUpload from "./components/ui/ImageUpload";
import ProcessedImage from "./components/ui/ProcessedImage";
import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";
import axios from "axios";

import "./App.css";

function App() {
  const [selectedMethod, setSelectedMethod] = useState(null);

  const handleApplyMethod = async (imageFile) => {
    if (!selectedMethod || !imageFile) return;

    const formData = new FormData();
    formData.append("method", selectedMethod);
    formData.append("image", imageFile);

    try {
      const response = await axios.post("http://localhost:5000/process", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Backend Response:", response.data);
      // TODO: Send the processed image data to <ProcessedImage />
    } catch (error) {
      console.error("Error processing image:", error);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <Header />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-1/5 min-w-[200px] bg-gray-100 border-r p-4">
          <Sidebar setSelectedMethod={setSelectedMethod} selectedMethod={selectedMethod} />
        </div>

        {/* Image Upload */}
        <div className="flex-1 p-4 flex items-center justify-center bg-white overflow-auto">
          <ImageUpload selectedMethod={selectedMethod} onApply={handleApplyMethod} />
        </div>

        {/* Processed Output */}
        <div className="w-1/5 min-w-[200px] bg-gray-50 border-l p-4">
          <ProcessedImage />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
