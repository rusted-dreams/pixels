/**
 * API service for image processing tasks
 */

// API base URL - will need to be updated with actual FastAPI backend URL
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000"; // Use relative path for easier deployment

/**
 * Send an image to the backend for processing
 * @param endpoint - API endpoint to send the request to
 * @param imageFile - The image file (or files) to process
 * @param params - Additional parameters for the processing task
 * @returns Response from the server
 */
export const processImage = async (
  endpoint: string,
  imageFile: File | File[],
  params?: Record<string, string | number>
): Promise<Response> => {
  const formData = new FormData();

  // Handle both single and multiple files
  if (Array.isArray(imageFile)) {
    // Multiple files
    imageFile.forEach((file, index) => {
      formData.append(`file${index + 1}`, file);
    });
  } else {
    // Single file
    formData.append("file", imageFile);
  }

  // Add any additional parameters
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Processing failed: ${errorData.detail || `Status ${response.status}`}`
    );
  }

  return response;
};

/**
 * Process image types based on Content-Type header
 * @param response - The fetch response
 * @returns Data URL for image display or Blob URL for ZIP files
 */
export const handleProcessedResponse = async (
  response: Response
): Promise<{
  type: "image" | "zip";
  url: string;
  filename: string;
}> => {
  const contentType = response.headers.get("Content-Type") || "";
  const contentDisposition = response.headers.get("Content-Disposition") || "";
  let filename = "processed-result";

  // Try to extract filename from Content-Disposition header
  const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
  if (filenameMatch && filenameMatch[1]) {
    filename = filenameMatch[1];
  }

  if (contentType.includes("image/")) {
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    return { type: "image", url, filename };
  } else if (contentType.includes("application/zip")) {
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    return { type: "zip", url, filename };
  }

  throw new Error(`Unsupported response type: ${contentType}`);
};
