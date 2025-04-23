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
        description: "Size of the kernel (must be odd)",
      },
      {
        id: "sigmaX",
        name: "Sigma X",
        type: "number",
        defaultValue: 0,
        min: 0,
        max: 10,
        step: 0.1,
        description: "Standard deviation in X direction",
      },
    ],
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
        description: "Order of derivative in X direction",
      },
      {
        id: "dy",
        name: "Y Derivative",
        type: "number",
        defaultValue: 0,
        min: 0,
        max: 2,
        step: 1,
        description: "Order of derivative in Y direction",
      },
      {
        id: "ksize",
        name: "Kernel Size",
        type: "number",
        defaultValue: 3,
        min: 1,
        max: 31,
        step: 2,
        description: "Size of the Sobel kernel",
      },
    ],
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
          { value: "both", label: "Both directions" },
        ],
        description: "Direction for edge detection",
      },
    ],
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
        description: "Size of the Laplacian kernel",
      },
      {
        id: "scale",
        name: "Scale",
        type: "number",
        defaultValue: 1,
        min: 0.1,
        max: 10,
        step: 0.1,
        description: "Scale factor for the computed Laplacian values",
      },
    ],
  },

  {
    id: "midpoint-filter",
    name: "midpoint Edge Detector",
    description: "Apply midpoint edge detection to an image",
    endpoint: "/api/task/midpoint-filter",
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
        description: "Size of the midpoint kernel",
      },
    ],
  },
  {
    id: "max-filter",
    name: "max Edge Detector",
    description: "Apply max edge detection to an image",
    endpoint: "/api/task/max-filter",
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
        description: "Size of the midpoint kernel",
      },
    ],
  },
  {
    id: "min-filter",
    name: "min Edge Detector",
    description: "Apply min edge detection to an image",
    endpoint: "/api/task/min-filter",
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
        description: "Size of the midpoint kernel",
      },
    ],
  },
  {
    id: "median-filter",
    name: "median Edge Detector",
    description: "Apply median edge detection to an image",
    endpoint: "/api/task/median-filter",
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
        description: "Size of the median kernel",
      },
    ],
  },
  {
    id: "powerlaw",
    name: "power law transformation",
    description: "Apply powerlaw transformation to an image",
    endpoint: "/api/task/power-law",
    category: "operations",
    parameters: [
      {
        id: "gamma",
        name: "gamma value",
        type: "number",
        defaultValue: 0,
        min: 0,
        max: 50,
        step: 0.01,
        description: "gamma value for the powerlaw",
      },
    ],
  },
  {
    id: "rotate",
    name: "rotate image",
    description: "rotate an image",
    endpoint: "/api/task/rotate",
    category: "basic",
    parameters: [
      {
        id: "angle",
        name: "angle",
        type: "number",
        defaultValue: 0,
        min: -360,
        max: 360,
        step: 1,
        description: "left or right rotate an image",
      },
    ],
  },
  {
    id: "translate",
    name: "translate image",
    description: "translate an image",
    endpoint: "/api/task/translate",
    category: "basic",
    parameters: [
      {
        id: "tx",
        name: "translate-X",
        type: "number",
        defaultValue: 0,
        min: -180,
        max: 180,
        step: 1,
        description: "translate x-direction",
      },
      {
        id: "ty",
        name: "translate-Y",
        type: "number",
        defaultValue: 0,
        min: -180,
        max: 180,
        step: 1,
        description: "translate y-direction",
      },
    ],
  },

  {
    id: "scale",
    name: "scale an image",
    description: "scale an image",
    endpoint: "/api/task/scale",
    category: "basic",
    parameters: [
      {
        id: "fx",
        name: "fx",
        type: "number",
        defaultValue: 1,
        min: 1,
        max: 10,
        step: 0.1,
        description: "size in x direction",
      },
      {
        id: "fy",
        name: "fy",
        type: "number",
        defaultValue: 1,
        min: 1,
        max: 10,
        step: 0.1,
        description: "size in y direction",
      },
    ],
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
