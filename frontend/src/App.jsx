import React, { useState } from "react";
import Sidebar from "./components/ui/Sidebar";
import ImageUpload from "./components/ui/ImageUpload";
import ProcessedImage from "./components/ui/ProcessedImage";
import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";

import "./App.css";

function App() {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [processedFileUrl, setProcessedFileUrl] = useState(null);
  const [fileType, setFileType] = useState(null); // "image" or "zip"

  const handleProcessed = (fileUrl, type) => {
    setProcessedFileUrl(fileUrl);
    setFileType(type);
    console.log("Processed file received:", fileUrl, type);
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
            onProcessed={handleProcessed}
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