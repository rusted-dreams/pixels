const ProcessedImage = () => {
  // We'll update this when backend is ready
  return (
    <div className="text-center">
      <h2 className="text-lg font-semibold mb-4">Processed Image</h2>
      <div className="w-full h-[400px] bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500">No image yet</span>
      </div>
    </div>
  );
};

export default ProcessedImage;
