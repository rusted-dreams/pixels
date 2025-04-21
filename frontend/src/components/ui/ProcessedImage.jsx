const ProcessedImage = ({ processedFileUrl, fileType }) => {
  if (!processedFileUrl) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Processed result will appear here
      </div>
    );
  }

  if (fileType === "image") {
    return (
      <div className="space-y-2">
        <h3 className="font-medium text-center">Processed Result</h3>
        <img
          src={processedFileUrl}
          alt="Processed result"
          className="max-w-full max-h-[70vh] mx-auto rounded shadow-md"
        />
      </div>
    );
  }

  if (fileType === "zip") {
    return (
      <div className="space-y-2">
        <h3 className="font-medium text-center">Download Results</h3>
        <a
          href={processedFileUrl}
          download="results.zip"
          className="block px-4 py-2 bg-blue-500 text-white rounded text-center hover:bg-blue-600"
        >
          Download ZIP
        </a>
      </div>
    );
  }

  return null;
};

export default ProcessedImage;