const ProcessedImage = ({ processedFileUrl, fileType }) => {
  return (
    <div className="text-center">
      <h2 className="text-lg font-semibold mb-4">Processed Output</h2>

      <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center rounded shadow">
        {!processedFileUrl ? (
          <span className="text-gray-500">No output yet</span>
        ) : fileType === "image" ? (
          <img
            src={processedFileUrl}
            alt="Processed"
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <a
            href={processedFileUrl}
            download="processed_output.zip"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Download ZIP
          </a>
        )}
      </div>
    </div>
  );
};

export default ProcessedImage;
