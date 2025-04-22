const ProcessedImage = ({ processedFileUrl, fileType, selectedMethod }) => {
  console.log("Selected Method:", selectedMethod); // Debug log

  const handleDownload = () => {
    if (!processedFileUrl) return;
    
    const link = document.createElement('a');
    link.href = processedFileUrl;
    link.download = `processed-result-${new Date().getTime()}.${fileType === 'image' ? 'png' : 'zip'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Method to description mapping
  const methodDescriptions = {
    // Color Transformations
    "rgb-channels": "Separates the image into its Red, Green, and Blue color channels",
    "grayscale": "Converts the image to grayscale (black and white)",
    "binary": "Converts the image to binary (black and white only) using thresholding",
    
    // Bitwise Operations
    "bitwise-and": "Applies bitwise AND operation between two images",
    "bitwise-or": "Applies bitwise OR operation between two images",
    "bitwise-xor": "Applies bitwise XOR operation between two images",
    
    // Geometric Transformations
    "sheer-image-horizontal": "Applies horizontal shear transformation to the image",
    "sheer-image-vertical": "Applies vertical shear transformation to the image",
    "resize": "Resizes the image to specified dimensions",
    
    // Intensity Transformations
    "log-transformation": "Enhances low-intensity pixels using logarithmic transform",
    "inverse-log-transformation": "Applies inverse logarithmic transformation",
    "power-law-transformation": "Adjusts image intensity using gamma correction"
  };

  const getDescriptionFromEndpoint = (endpoint) => {
    console.log("Endpoint received:", endpoint); // Debug log
    if (!endpoint) return "Image processing result";
    const methodKey = endpoint.split('/').pop();
    console.log("Extracted method key:", methodKey); // Debug log
    return methodDescriptions[methodKey] || "Image processing result";
  };

  if (!processedFileUrl) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Processed result will appear here
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Descriptive heading - now with border and padding for visibility */}
      <div className="border-b pb-2 mb-3">
        <h2 className="text-lg font-semibold text-center text-gray-700">
          {getDescriptionFromEndpoint(selectedMethod)}
        </h2>
      </div>

      {/* Image container */}
      <div className="flex-1 flex flex-col items-center justify-start">
        {fileType === "image" ? (
          <>
            <img
              src={processedFileUrl}
              alt="Processed result"
              className="max-w-full max-h-[65vh] object-contain mb-3"
            />
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              Download Result
            </button>
          </>
        ) : (
          <div className="text-center">
            <p className="mb-4">Processed ZIP file ready for download</p>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Download ZIP
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessedImage;