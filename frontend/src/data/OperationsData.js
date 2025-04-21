const operationsData = [
  {
    category: "Color Transformations",
    methods: [
      { name: "RGB Channels", endpoint: "/api/task/rgb-channels" },
      { name: "Grayscale", endpoint: "/api/task/grayscale" },
      { name: "Binary", endpoint: "/api/task/binary" },
    ],
  },
  {
    category: "Bitwise Operations",
    methods: [
      { name: "Bitwise AND", endpoint: "/api/task/bitwise-and" },
      { name: "Bitwise OR", endpoint: "/api/task/bitwise-or" },
      { name: "Bitwise XOR", endpoint: "/api/task/bitwise-xor" },
    ],
  },
  {
    category: "Geometric Transformations",
    methods: [
      { name: "Sheer Horizontal", endpoint: "/api/task/sheer-image-horizontal" },
      { name: "Sheer Vertical", endpoint: "/api/task/sheer-image-vertical" },
      { name: "Resize", endpoint: "/api/task/resize" },
    ],
  },
  {
    category: "Intensity Transformations",
    methods: [
      { name: "Log Transformation", endpoint: "/api/task/log-transformation" },
      { name: "Inverse Log Transformation", endpoint: "/api/task/inverse-log-transformation" },
      { name: "Power Law Transformation", endpoint: "/api/task/power-law-transformation" },
    ],
  },
];

export default operationsData;
