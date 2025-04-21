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
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [processedFileUrl, setProcessedFileUrl] = useState(null);
  const [fileType, setFileType] = useState(null); // "image" or "zip"

  const handleApplyMethod = async (imageFile) => {
    if (!selectedEndpoint || !imageFile) {
      console.warn("Missing endpoint or image file.");
      return;
    }

    if (!imageFile) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();

    // ✅ Optional: Log what's in FormData (not fully readable but useful for debugging)
  for (let pair of formData.entries()) {
    console.log(`${pair[0]}:`, pair[1]);
  }

    try {
      console.log(formData); // Log the file to ensure it's being appended correctly
      
      const response = await axios.post(
        `http://localhost:5000${selectedEndpoint}`, // ✅ Make sure your backend is running on port 8000
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob", // For binary data (image or zip)
        }
      );

      const contentType = response.headers["content-type"];
      const blob = new Blob([response.data], { type: contentType });
      const url = URL.createObjectURL(blob);

      if (contentType === "application/zip") {
        setFileType("zip");
      } else if (contentType.startsWith("image/")) {
        setFileType("image");
      } else {
        console.error("⚠️ Unsupported file type received:", contentType);
        return;
      }

      setProcessedFileUrl(url);
      console.log("✅ Processed file URL:", url);
    } catch (error) {
      console.error("❌ Error processing image:", error);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <Header />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-1/5 min-w-[200px] bg-gray-100 border-r p-4">
          <Sidebar
            setSelectedMethod={setSelectedMethod}
            selectedMethod={selectedMethod}
            setSelectedEndpoint={setSelectedEndpoint}
          />
        </div>

        {/* Image Upload */}
        <div className="flex-1 p-4 flex items-center justify-center bg-white overflow-auto">
          <ImageUpload
            selectedMethod={selectedMethod}
            selectedEndpoint={selectedEndpoint}
            onApply={handleApplyMethod}
          />
        </div>

        {/* Processed Output */}
        <div className="w-1/5 min-w-[200px] bg-gray-50 border-l p-4">
          <ProcessedImage
            processedFileUrl={processedFileUrl}
            fileType={fileType}
          />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
