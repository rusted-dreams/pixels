import { useState } from "react";
import axios from "axios";

const ImageUpload = ({ selectedMethod }) => {
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);

  const handleUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setImage(URL.createObjectURL(uploadedFile));
      setFile(uploadedFile);
    }
  };

  const handleReset = () => {
    setImage(null);
    setFile(null);
  };

  const handleApply = async () => {
    if (!file || !selectedMethod) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("method", selectedMethod);

    try {
      const response = await axios.post("http://localhost:5000/process", formData);
      console.log("Processed Image Response:", response.data);
      // TODO: show processed image on right panel
    } catch (error) {
      console.error("Error processing image:", error);
    }
  };

  return (
    <div className="text-center space-y-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="block mx-auto text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0
                   file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-700
                   hover:file:bg-blue-100"
      />

      {image && (
        <div className="space-y-4">
          <img
            src={image}
            alt="Uploaded"
            className="max-h-[400px] mx-auto rounded shadow-md"
          />

          <div className="flex justify-center gap-4">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Remove Image
            </button>

            {selectedMethod && (
              <button
                onClick={handleApply}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Apply "{selectedMethod}"
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
