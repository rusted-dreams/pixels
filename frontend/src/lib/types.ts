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
  parameters?: TaskParameter[]; // Optional parameters for the task
}

// Task parameter definition
export interface TaskParameter {
  id: string;
  name: string;
  type: "number" | "select";
  defaultValue: number | string;
  min?: number; // For number type
  max?: number; // For number type
  step?: number; // For number type
  options?: Array<{ value: string; label: string }>; // For select type
  description?: string;
}

// Task categories
export type TaskCategory =
  | "basic"
  | "filters"
  | "enhancements"
  | "channels"
  | "operations";

// Result of a processing task
export type ProcessingResult = {
  originalImage: string;
  processedImages:
    | { type: "single"; url: string }
    | { type: "multiple"; images: Array<{ name: string; url: string }> };
};
