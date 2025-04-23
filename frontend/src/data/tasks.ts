import { ProcessingTask } from "@/lib/types";

/**
 * Available image processing tasks with their endpoints
 */
export const processingTasks: ProcessingTask[] = [
  {
    id: "negative",
    name: "Negative",
    description: "Generate the negative (inverse) of an image",
    endpoint: "/api/task/negative",
    category: "basic",
  },
  {
    id: "rgb-channels",
    name: "RGB Channels",
    description: "Separate the red, green, and blue channels of an image",
    endpoint: "/api/task/rgb-channels",
    category: "channels",
    returnsZip: true,
  },
  {
    id: "grayscale",
    name: "Grayscale",
    description: "Convert an image to grayscale",
    endpoint: "/api/task/grayscale",
    category: "basic",
  },
  {
    id: "binary",
    name: "Binary",
    description: "Convert an image to binary",
    endpoint: "/api/task/binary",
    category: "basic",
  },

  {
    id: "shear-vertical",
    name: "shear image vertical",
    description: "shear image vertical",
    endpoint: "/api/task/shear-image-vertical",
    category: "basic",
  },

  {
    id: "shear-horizontal",
    name: "shear image horizontal",
    description: "shear image horizontal",
    endpoint: "/api/task/shear-image-horizontal",
    category: "basic",
  },
  {
    id: "blur",
    name: "Blur",
    description: "Apply a Gaussian blur to an image",
    endpoint: "/api/task/gaussian-blur",
    category: "enhancement",
  },
  {
    id: "sobel",
    name: "Sobel Edge Detection",
    description: "Apply Sobel edge detection to an image",
    endpoint: "/api/task/sobel",
    category: "filters",
  },
  {
    id: "prewitt",
    name: "Prewitt Edge Detection",
    description: "Apply Prewitt edge detection to an image",
    endpoint: "/api/task/prewitt",
    category: "filters",
  },
  {
    id: "Laplacian filter",
    name: "laplacian edge detector",
    description: "Apply laplacin edge detection to an image",
    endpoint: "/api/task/laplacian-filter",
    category: "filters",
  },
  {
    id: "denoise",
    name: "Noise Removal",
    description: "Remove noise from an image",
    endpoint: "/api/task/denoise",
    category: "enhancement",
  },
  {
    id: "xor",
    name: "XOR Operation",
    description: "Apply XOR operation between two images",
    endpoint: "/api/task/xor",
    category: "operations",
    requiresMultipleImages: true,
  },
];

/**
 * Get tasks organized by categories
 */
export const getTasksByCategory = () => {
  const categorized: Record<string, ProcessingTask[]> = {};

  processingTasks.forEach((task) => {
    if (!categorized[task.category]) {
      categorized[task.category] = [];
    }
    categorized[task.category].push(task);
  });

  return categorized;
};

/**
 * Get a task by its ID
 */
export const getTaskById = (id: string): ProcessingTask | undefined => {
  return processingTasks.find((task) => task.id === id);
};
