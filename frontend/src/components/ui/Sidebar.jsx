import React, { useState } from "react";
import operationsData from "../../data/OperationsData";

function Sidebar({ selectedMethod, setSelectedMethod, setSelectedEndpoint }) {
  const [openCategory, setOpenCategory] = useState(null);

  const toggleCategory = (category) => {
    setOpenCategory(prev => (prev === category ? null : category));
  };

  const handleMethodClick = (methodObj) => {
    setSelectedMethod(methodObj.name);
    setSelectedEndpoint(methodObj.endpoint);
    console.log("🔘 Selected Method:", methodObj.name);
    console.log("🔗 Selected Endpoint:", methodObj.endpoint);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">🧪 Image Filters</h2>

      {operationsData.map((operation, index) => (
        <div key={index}>
          <button
            onClick={() => toggleCategory(operation.category)}
            className="w-full text-left font-medium py-2 px-3 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            {operation.category}
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              openCategory === operation.category
                ? "max-h-96 opacity-100 mt-2"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="pl-4 space-y-1">
              {operation.methods.map((methodObj, idx) => (
                <button
                  key={idx}
                  onClick={() => handleMethodClick(methodObj)}
                  title={`Apply ${methodObj.name}`}
                  className={`w-full text-left text-sm px-2 py-1 rounded transition-colors duration-200 ${
                    selectedMethod === methodObj.name
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {methodObj.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Sidebar;