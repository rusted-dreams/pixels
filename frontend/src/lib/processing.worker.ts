import cvModule from "@techstark/opencv-js";
import { processPixels } from "./imageProcessing";
import type { WorkerRequest, WorkerResponse } from "./processingTypes";

// Wrap the result because older Emscripten modules are self-resolving thenables.
const ready = new Promise<{ cv: typeof cvModule }>((resolve, reject) => {
  const module = cvModule as typeof cvModule & {
    then?: (callback: (cv: typeof cvModule) => void) => void;
    onAbort?: (reason: string) => void;
  };
  if (module.Mat) resolve({ cv: module });
  else if (module.then) module.then(cv => resolve({ cv }));
  else module.onRuntimeInitialized = () => resolve({ cv: module });
  module.onAbort = reason => reject(new Error(`OpenCV initialization failed: ${reason}`));
});

self.onmessage = async ({ data }: MessageEvent<WorkerRequest>) => {
  try {
    const { cv } = await ready;
    const response = processPixels(cv, data);
    self.postMessage(response, { transfer: response.images.map(result => result.image.data.buffer) });
  } catch (error) {
    const response: WorkerResponse = {
      error: error instanceof Error ? error.message : `OpenCV could not process this image (${String(error)}). Check the task parameters.`,
    };
    self.postMessage(response);
  }
};
