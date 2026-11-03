import JSZip from "jszip";
import type { WorkerRequest, WorkerResponse } from "./processingTypes";

/** Decode locally; images are never uploaded. */
async function decodeImage(file: File): Promise<ImageData> {
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) throw new Error("Could not read the image in this browser");
    context.drawImage(image, 0, 0);
    return context.getImageData(0, 0, canvas.width, canvas.height);
  } catch {
    throw new Error(`Could not decode ${file.name}. Please select a valid image.`);
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function encodeImage(image: ImageData): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not encode the processed image");
  context.putImageData(image, 0, 0);
  return new Promise((resolve, reject) => canvas.toBlob(
    blob => blob ? resolve(blob) : reject(new Error("Could not encode the processed image")),
    "image/png",
  ));
}

/** Preserve the response contract while performing all work in a local worker. */
export async function processImage(
  endpoint: string,
  imageFile: File | File[],
  params: Record<string, string | number> = {},
): Promise<Response> {
  const files = Array.isArray(imageFile) ? imageFile : [imageFile];
  if (!files.length) throw new Error("Please select an image");
  const images = await Promise.all(files.map(decodeImage));
  const worker = new Worker(new URL("./processing.worker.ts", import.meta.url), { type: "module" });
  try {
    const results = await new Promise<WorkerResponse>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("Image processing timed out. Try a smaller image.")), 120_000);
      worker.onmessage = ({ data }: MessageEvent<WorkerResponse>) => {
        clearTimeout(timer);
        if (data.error) reject(new Error(data.error));
        else resolve(data);
      };
      worker.onerror = () => {
        clearTimeout(timer);
        reject(new Error("Could not initialize OpenCV.js. Please reload and try again."));
      };
      worker.onmessageerror = () => {
        clearTimeout(timer);
        reject(new Error("Could not read the processing result"));
      };
      const request: WorkerRequest = { endpoint, images, params };
      worker.postMessage(request, images.map(image => image.data.buffer));
    });
    if (!results.images?.length) throw new Error("No image was produced");
    if (results.zip) {
      const zip = new JSZip();
      for (const result of results.images) {
        zip.file(result.name, await (await encodeImage(result.image)).arrayBuffer());
      }
      return new Response(await zip.generateAsync({ type: "blob" }), {
        headers: { "Content-Type": "application/zip", "Content-Disposition": 'attachment; filename="rgb_channels.zip"' },
      });
    }
    return new Response(await encodeImage(results.images[0].image), {
      headers: { "Content-Type": "image/png", "Content-Disposition": 'attachment; filename="processed-result.png"' },
    });
  } finally {
    // Frees the WASM heap, even after a failed operation or timeout.
    worker.terminate();
  }
}

export async function handleProcessedResponse(response: Response): Promise<{
  type: "image" | "zip";
  url: string;
  filename: string;
}> {
  const contentType = response.headers.get("Content-Type") || "";
  const filename = response.headers.get("Content-Disposition")?.match(/filename="?([^";]+)"?/)?.[1];
  const type = contentType.includes("image/") ? "image" : contentType.includes("application/zip") ? "zip" : null;
  if (!type) throw new Error(`Unsupported response type: ${contentType}`);
  return {
    type,
    url: URL.createObjectURL(await response.clone().blob()),
    filename: filename || (type === "zip" ? "processed-result.zip" : "processed-result.png"),
  };
}
