
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
    name: "Shear Image Vertical",
    description: "Shear image vertical",
    endpoint: "/api/task/shear-image-vertical",
    category: "basic",
  },
  {
    id: "shear-horizontal",
    name: "Shear Image Horizontal",
    description: "Shear image horizontal",
    endpoint: "/api/task/shear-image-horizontal",
    category: "basic",
  },
  {
    id: "blur",
    name: "Gaussian Blur",
    description: "Apply a Gaussian blur to an image",
    endpoint: "/api/task/gaussian",
    category: "enhancement",
    parameters: [
      {
        id: "ksize",
        name: "Kernel Size",
        type: "number",
        defaultValue: 5,
        min: 1,
        max: 31,
        step: 2,
        description: "Size of the kernel (must be odd)"
      },
      {
        id: "sigmaX",
        name: "Sigma X",
        type: "number",
        defaultValue: 0,
        min: 0,
        max: 10,
        step: 0.1,
        description: "Standard deviation in X direction"
      }
    ]
  },
  {
    id: "sobel",
    name: "Sobel Edge Detection",
    description: "Apply Sobel edge detection to an image",
    endpoint: "/api/task/sobel",
    category: "filters",
    parameters: [
      {
        id: "dx",
        name: "X Derivative",
        type: "number",
        defaultValue: 1,
        min: 0,
        max: 2,
        step: 1,
        description: "Order of derivative in X direction"
      },
      {
        id: "dy",
        name: "Y Derivative",
        type: "number",
        defaultValue: 0,
        min: 0,
        max: 2,
        step: 1,
        description: "Order of derivative in Y direction"
      },
      {
        id: "ksize",
        name: "Kernel Size",
        type: "number",
        defaultValue: 3,
        min: 1,
        max: 31,
        step: 2,
        description: "Size of the Sobel kernel"
      }
    ]
  },
  {
    id: "prewitt",
    name: "Prewitt Edge Detection",
    description: "Apply Prewitt edge detection to an image",
    endpoint: "/api/task/prewitt",
    category: "filters",
    parameters: [
      {
        id: "axis",
        name: "Direction",
        type: "select",
        defaultValue: "x",
        options: [
          { value: "x", label: "X direction" },
          { value: "y", label: "Y direction" },
          { value: "both", label: "Both directions" }
        ],
        description: "Direction for edge detection"
      }
    ]
  },
  {
    id: "laplacian-filter",
    name: "Laplacian Edge Detector",
    description: "Apply Laplacian edge detection to an image",
    endpoint: "/api/task/laplacian-filter",
    category: "filters",
    parameters: [
      {
        id: "ksize",
        name: "Kernel Size",
        type: "number",
        defaultValue: 3,
        min: 1,
        max: 31,
        step: 2,
        description: "Size of the Laplacian kernel"
      },
      {
        id: "scale",
        name: "Scale",
        type: "number",
        defaultValue: 1,
        min: 0.1,
        max: 10,
        step: 0.1,
        description: "Scale factor for the computed Laplacian values"
      }
    ]
  },
  {
    id: "denoise",
    name: "Noise Removal",
    description: "Remove noise from an image",
    endpoint: "/api/task/denoise",
    category: "enhancement",
    parameters: [
      {
        id: "strength",
        name: "Strength",
        type: "number",
        defaultValue: 10,
        min: 1,
        max: 30,
        step: 1,
        description: "Strength of denoising"
      }
    ]
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
