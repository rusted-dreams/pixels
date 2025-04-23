
/**
 * Types for the image processing app
 */

// Available image processing tasks
export interface ProcessingTask {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  category: TaskCategory;
  returnsZip?: boolean; // Whether the task returns multiple images in a ZIP file
  requiresMultipleImages?: boolean; // Whether the task requires multiple images as input
}

// Task categories
export type TaskCategory =
  | "basic"
  | "filters"
  | "enhancement"
  | "channels"
  | "operations";

// Result of a processing task
export type ProcessingResult = {
  originalImage: string;
  processedImages: 
    | { type: "single"; url: string } 
    | { type: "multiple"; images: Array<{ name: string; url: string }> };
};
