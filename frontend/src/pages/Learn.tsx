import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTasksByCategory } from "@/data/tasks";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ProcessingTask } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface TaskExplanation {
  [key: string]: {
    theory: string;
    explanation: string;
    applications: string[];
    furtherReading: string;
    creativityCorner: string;
  };
}

const explanations: TaskExplanation = {
  negative: {
    theory: "Image negatives invert all pixel values in an image. For an 8-bit grayscale image, a pixel value of 255 becomes 0, 254 becomes 1, and so on.",
    explanation: "The negative transformation is given by the equation: s = L - 1 - r, where r is the input pixel value, s is the output pixel value, and L is the maximum pixel value (typically 255 for 8-bit images).",
    applications: [
      "Medical imaging to enhance white or grey detail embedded in dark regions",
      "Film negatives in traditional photography",
      "Artistic effects and image enhancement"
    ],
    furtherReading: "Digital Image Processing by Gonzalez & Woods, Chapter 3.2",
    creativityCorner: "Try using image negatives on portraits to create a ghostly, ethereal effect. Or, use it on landscapes to turn a day scene into a surreal night scene."
  },
  "rgb-channels": {
    theory: "Color images typically store RGB (Red, Green, Blue) values for each pixel. Separating these channels allows analysis of each color component independently.",
    explanation: "Each pixel in a color image is represented as a combination of red, green, and blue intensities. Channel separation extracts each component into separate grayscale images.",
    applications: [
      "Color correction and balancing",
      "Feature detection in specific color ranges",
      "Color-based segmentation"
    ],
    furtherReading: "Fundamentals of Digital Image Processing by Anil K. Jain, Chapter 4",
    creativityCorner: "Experiment with recombining color channels in different orders to create psychedelic effects. For example, map the red channel to blue, green to red, and blue to green."
  },
  grayscale: {
    theory: "Grayscale conversion reduces a color image to shades of gray, eliminating color information while preserving luminance.",
    explanation: "The standard formula is: Gray = 0.299×Red + 0.587×Green + 0.114×Blue. This formula accounts for human perception of brightness in different colors.",
    applications: [
      "Preprocessing for many computer vision algorithms",
      "Reducing computational complexity",
      "Emphasizing texture and shape over color"
    ],
    furtherReading: "Computer Vision: Algorithms and Applications by Richard Szeliski, Section 2.3",
    creativityCorner: "Use grayscale to create a classic, timeless feel in your photos. It's also a great way to emphasize texture and form without the distraction of color."
  },
  sobel: {
    theory: "Sobel edge detection uses gradient calculations to highlight regions of high spatial frequency, which often correspond to edges in images.",
    explanation: "It applies two 3×3 kernels to calculate approximations of derivatives - one for horizontal changes and one for vertical. The combined magnitude reveals edges.",
    applications: [
      "Object boundary detection",
      "Feature extraction",
      "Image segmentation preprocessing"
    ],
    furtherReading: "Digital Image Processing Using MATLAB by Gonzalez, Woods & Eddins, Chapter 6",
    creativityCorner: "Combine the output of a Sobel filter with the original image to create a 'sketch' effect. You can also color the edges to make them stand out."
  },
  segment: {
    theory: "Image segmentation partitions an image into multiple segments (sets of pixels, also known as super-pixels). The goal of segmentation is to simplify and/or change the representation of an image into something that is more meaningful and easier to analyze.",
    explanation: "Segmentation algorithms are based on one of two basic properties of intensity values: discontinuity and similarity. The principal approaches in the first category are based on edge detection. The principal approaches in the second category are based on thresholding, region growing, and region splitting and merging.",
    applications: [
      "Medical imaging",
      "Object detection",
      "Face recognition"
    ],
    furtherReading: "Digital Image Processing by Gonzalez & Woods, Chapter 10",
    creativityCorner: "Use segmentation to create a 'pop art' effect by coloring each segment with a different vibrant color. You can also use it to isolate objects and place them in new backgrounds."
  },
  hitmiss: {
    theory: "The Hit-or-Miss transform is a basic tool for shape detection. It can be used to find patterns in binary images.",
    explanation: "The Hit-or-Miss transform uses a structuring element (or a pair of structuring elements) to find patterns in a binary image. The structuring element is a small binary image that is used to probe the input image. The output of the transform is a binary image that shows where the pattern was found.",
    applications: [
      "Shape detection",
      "Pattern recognition",
      "Object detection"
    ],
    furtherReading: "Digital Image Processing by Gonzalez & Woods, Chapter 9",
    creativityCorner: "Create your own structuring elements to find unique shapes in an image. You could even use it to find letters or symbols in a noisy image."
  },
  binary: {
    theory: "A binary image is a digital image that has only two possible values for each pixel. Typically, the two colors used for a binary image are black and white.",
    explanation: "Binary images are produced from grayscale images by thresholding. The thresholding operation replaces each pixel in an image with a black pixel if the image intensity is less than some fixed constant (the threshold), or a white pixel if the image intensity is greater than that constant.",
    applications: [
      "Image segmentation",
      "Object detection",
      "Pattern recognition"
    ],
    furtherReading: "Digital Image Processing by Gonzalez & Woods, Chapter 2",
    creativityCorner: "Use binary images to create high-contrast, graphic-style images. You can also use them as masks to apply effects to specific parts of an image."
  },
  "shear-vertical": {
    theory: "Shearing is a transformation that slants the shape of an object. The shear can be in one direction or in two directions.",
    explanation: "A vertical shear is a shear transformation that displaces each point in a direction parallel to the vertical axis. The amount of displacement is proportional to the point's distance from the horizontal axis.",
    applications: [
      "Computer graphics",
      "Image processing",
      "Geomatics"
    ],
    furtherReading: "Fundamentals of Computer Graphics by Peter Shirley, Chapter 6",
    creativityCorner: "Use vertical shear to create a sense of speed or motion in a static image. It can also be used to create interesting abstract patterns."
  },
  "shear-horizontal": {
    theory: "Shearing is a transformation that slants the shape of an object. The shear can be in one direction or in two directions.",
    explanation: "A horizontal shear is a shear transformation that displaces each point in a direction parallel to the horizontal axis. The amount of displacement is proportional to the point's distance from the vertical axis.",
    applications: [
      "Computer graphics",
      "Image processing",
      "Geomatics"
    ],
    furtherReading: "Fundamentals of Computer Graphics by Peter Shirley, Chapter 6",
    creativityCorner: "Use horizontal shear to create a 'falling' or 'leaning' effect. It's a great way to add a dynamic touch to your images."
  },
  blur: {
    theory: "Gaussian blur is a type of image-blurring filter that uses a Gaussian function (which expresses the normal distribution in statistics) for calculating the transformation to apply to each pixel in the image.",
    explanation: "The Gaussian blur is a low-pass filter that removes high-frequency components from the image. It is implemented as a convolution with a Gaussian kernel.",
    applications: [
      "Noise reduction",
      "Image smoothing",
      "Edge detection"
    ],
    furtherReading: "Digital Image Processing by Gonzalez & Woods, Chapter 3",
    creativityCorner: "Use Gaussian blur to create a 'dreamy' or 'soft focus' effect. You can also use it to de-emphasize the background and make the subject stand out."
  },
  prewitt: {
    theory: "The Prewitt operator is used in image processing for edge detection. It is a discrete differentiation operator, computing an approximation of the gradient of the image intensity function.",
    explanation: "The Prewitt operator is similar to the Sobel operator. It uses two 3x3 kernels to detect edges in an image. One kernel is for horizontal edges and the other is for vertical edges.",
    applications: [
      "Edge detection",
      "Feature extraction",
      "Image segmentation"
    ],
    furtherReading: "Digital Image Processing by Gonzalez & Woods, Chapter 10",
    creativityCorner: "Like the Sobel filter, the Prewitt filter can be used to create a 'sketch' effect. Try experimenting with different thresholds to get different line weights."
  },
  "laplacian-filter": {
    theory: "The Laplacian is a 2-D isotropic measure of the 2nd spatial derivative of an image. The Laplacian of an image highlights regions of rapid intensity change and is therefore often used for edge detection.",
    explanation: "The Laplacian is usually applied to an image that has first been smoothed with something approximating a Gaussian smoothing filter in order to reduce its sensitivity to noise.",
    applications: [
      "Edge detection",
      "Blob detection",
      "Image sharpening"
    ],
    furtherReading: "Digital Image Processing by Gonzalez & Woods, Chapter 10",
    creativityCorner: "The Laplacian filter is great for finding fine details in an image. Use it to enhance the texture of surfaces like wood or stone."
  },
  "midpoint-filter": {
    theory: "The midpoint filter is a non-linear filter that is used for noise reduction. It is a statistical filter that replaces the value of a pixel by the midpoint of the values of the pixels in a neighborhood.",
    explanation: "The midpoint filter is defined as the midpoint of the maximum and minimum values in a neighborhood. It is a good filter for removing salt-and-pepper noise.",
    applications: [
      "Noise reduction",
      "Image smoothing",
      "Image enhancement"
    ],
    furtherReading: "Digital Image Processing by Gonzalez & Woods, Chapter 5",
    creativityCorner: "The midpoint filter can create interesting artistic effects, especially on images with a lot of texture. Try it on portraits to create a 'painted' look."
  },
  "max-filter": {
    theory: "The max filter is a non-linear filter that is used for noise reduction. It is a statistical filter that replaces the value of a pixel by the maximum of the values of the pixels in a neighborhood.",
    explanation: "The max filter is defined as the maximum of the values in a neighborhood. It is a good filter for finding the brightest points in an image.",
    applications: [
      "Noise reduction",
      "Image smoothing",
      "Image enhancement"
    ],
    furtherReading: "Digital Image Processing by Gonzalez & Woods, Chapter 5",
    creativityCorner: "Use the max filter to create a 'glowing' effect around bright objects in an image. It can also be used to create abstract patterns from simple shapes."
  },
  "min-filter": {
    theory: "The min filter is a non-linear filter that is used for noise reduction. It is a statistical filter that replaces the value of a pixel by the minimum of the values of the pixels in a neighborhood.",
    explanation: "The min filter is defined as the minimum of the values in a neighborhood. It is a good filter for finding the darkest points in an image.",
    applications: [
      "Noise reduction",
      "Image smoothing",
      "Image enhancement"
    ],
    furtherReading: "Digital Image Processing by Gonzalez & Woods, Chapter 5",
    creativityCorner: "Use the min filter to create a 'shrinking' or 'eroding' effect. It can be used to make objects look older or more weathered."
  },
  "median-filter": {
    theory: "The median filter is a non-linear digital filtering technique, often used to remove noise from an image or signal. Such noise reduction is a typical pre-processing step to improve the results of later processing (for example, edge detection on an image).",
    explanation: "The median filter is a sliding window spatial filter that replaces the center value in the window with the median of all the pixel values in the window.",
    applications: [
      "Noise reduction",
      "Image smoothing",
      "Image enhancement"
    ],
    furtherReading: "Digital Image Processing by Gonzalez & Woods, Chapter 5",
    creativityCorner: "The median filter is great for removing noise while preserving edges. Use it to clean up old photos or to create a 'painterly' effect."
  },
  log: {
    theory: "The Laplacian of Gaussian (LoG) is a combination of Gaussian and Laplacian filters. It is used for edge detection.",
    explanation: "The LoG filter first applies a Gaussian blur to the image to reduce noise. Then it applies a Laplacian filter to the blurred image to detect edges.",
    applications: [
      "Edge detection",
      "Blob detection",
      "Image sharpening"
    ],
    furtherReading: "Digital Image Processing by Gonzalez & Woods, Chapter 10",
    creativityCorner: "The LoG filter is great for finding blobs and other circular shapes in an image. Use it to find cells in a microscope image or stars in a night sky."
  },
  highpass: {
    theory: "A high-pass filter is a filter that passes high-frequency signals but attenuates signals with frequencies lower than the cutoff frequency.",
    explanation: "In image processing, a high-pass filter can be used to sharpen an image. It is implemented as a convolution with a high-pass kernel.",
    applications: [
      "Image sharpening",
      "Edge detection",
      "Feature extraction"
    ],
    furtherReading: "Digital Image Processing by Gonzalez & Woods, Chapter 4",
    creativityCorner: "Use a high-pass filter to make the details in your photos 'pop'. It's a great way to add a sense of clarity and sharpness to an image."
  },
  lowpass: {
    theory: "A low-pass filter is a filter that passes low-frequency signals but attenuates signals with frequencies higher than the cutoff frequency.",
    explanation: "In image processing, a low-pass filter can be used to blur an image. It is implemented as a convolution with a low-pass kernel.",
    applications: [
      "Image blurring",
      "Noise reduction",
      "Image smoothing"
    ],
    furtherReading: "Digital Image Processing by Gonzalez & Woods, Chapter 4",
    creativityCorner: "Use a low-pass filter to create a 'soft' or 'dreamy' look. It's also a great way to remove unwanted details from an image."
  },
  highboost: {
    theory: "High-boost filtering is a sharpening technique that is a generalization of high-pass filtering. It is used to enhance the high-frequency components of an image while keeping the low-frequency components.",
    explanation: "A high-boost filter is a high-pass filter with an added constant. The constant is called the boost factor. A boost factor greater than 1 will sharpen the image.",
    applications: [
      "Image sharpening",
      "Edge detection",
      "Feature extraction"
    ],
    furtherReading: "Digital Image Processing by Gonzalez & Woods, Chapter 4",
    creativityCorner: "High-boost filtering is a great way to add a sense of 'punch' to your images. Use it to make your photos look more dramatic and impactful."
  },
  rayleigh: {
    theory: "Rayleigh noise is a type of noise that is often found in medical images. It is a multiplicative noise that is characterized by a Rayleigh probability density function.",
    explanation: "Rayleigh noise can be modeled as the square root of the sum of the squares of two independent Gaussian random variables. It is often used to model the noise in ultrasound images.",
    applications: [
      "Medical imaging",
      "Ultrasound imaging",
      "Radar imaging"
    ],
    furtherReading: "Digital Image Processing by Gonzalez & Woods, Chapter 5",
    creativityCorner: "While Rayleigh noise is usually something you want to remove, you can also add it to an image to create a 'vintage' or 'distressed' look."
  },
  powerlaw: {
    theory: "Power-law (gamma) transformations are used to correct for the non-linear response of display devices. They are also used to enhance the contrast of an image.",
    explanation: "The power-law transformation is given by the equation: s = c * r^gamma, where r is the input pixel value, s is the output pixel value, c is a constant, and gamma is the power-law exponent.",
    applications: [
      "Contrast enhancement",
      "Gamma correction",
      "Image enhancement"
    ],
    furtherReading: "Digital Image Processing by Gonzalez & Woods, Chapter 3",
    creativityCorner: "Use power-law transformations to brighten up dark photos or to add a sense of drama to your images. You can also use it to create a 'bleach bypass' effect."
  },
  rotate: {
    theory: "Image rotation is a geometric transformation that rotates an image by a certain angle around a certain point.",
    explanation: "The rotation of an image is a transformation that maps a point (x, y) to a new point (x', y') by rotating it by an angle theta around the origin. The new coordinates are given by: x' = x * cos(theta) - y * sin(theta) and y' = x * sin(theta) + y * cos(theta).",
    applications: [
      "Image alignment",
      "Image registration",
      "Computer graphics"
    ],
    furtherReading: "Digital Image Processing by Gonzalez & Woods, Chapter 2",
    creativityCorner: "Use rotation to create a 'Dutch angle' effect, or to create interesting abstract patterns from simple shapes."
  },
  translate: {
    theory: "Image translation is a geometric transformation that moves an image by a certain amount in a certain direction.",
    explanation: "The translation of an image is a transformation that maps a point (x, y) to a new point (x', y') by adding a translation vector (tx, ty). The new coordinates are given by: x' = x + tx and y' = y + ty.",
    applications: [
      "Image alignment",
      "Image registration",
      "Computer graphics"
    ],
    furtherReading: "Digital Image Processing by Gonzalez & Woods, Chapter 2",
    creativityCorner: "Use translation to create a 'glitch' effect, or to create a sense of movement in a static image."
  },
  scale: {
    theory: "Image scaling is a geometric transformation that changes the size of an image.",
    explanation: "The scaling of an image is a transformation that maps a point (x, y) to a new point (x', y') by multiplying the coordinates by a scaling factor. The new coordinates are given by: x' = fx * x and y' = fy * y.",
    applications: [
      "Image resizing",
      "Image zooming",
      "Computer graphics"
    ],
    furtherReading: "Digital Image Processing by Gonzalez & Woods, Chapter 2",
    creativityCorner: "Use scaling to create a 'dolly zoom' effect, or to create a sense of depth in a 2D image."
  },
  "gaussian-noise": {
    theory: "Gaussian noise is a type of noise that is characterized by a Gaussian probability density function. It is a common type of noise that is found in images.",
    explanation: "Gaussian noise is an additive noise that is evenly distributed over the signal. It is often used to model the noise in images that are acquired with a digital camera.",
    applications: [
      "Image restoration",
      "Image denoising",
      "Image enhancement"
    ],
    furtherReading: "Digital Image Processing by Gonzalez & Woods, Chapter 5",
    creativityCorner: "While Gaussian noise is usually something you want to remove, you can also add it to an image to create a 'film grain' effect."
  },
  closing: {
    theory: "Closing is a morphological operation that is used to fill small holes in an image. It is the opposite of opening.",
    explanation: "Closing is defined as a dilation followed by an erosion. It is used to fill small holes in an image and to connect nearby objects.",
    applications: [
      "Image segmentation",
      "Object detection",
      "Pattern recognition"
    ],
    furtherReading: "Digital Image Processing by Gonzalez & Woods, Chapter 9",
    creativityCorner: "Use closing to make text or other objects in an image look 'bolder' or 'thicker'. It can also be used to repair broken lines or shapes."
  },
  opening: {
    theory: "Opening is a morphological operation that is used to remove small objects from an image. It is the opposite of closing.",
    explanation: "Opening is defined as an erosion followed by a dilation. It is used to remove small objects from an image and to separate objects that are close to each other.",
    applications: [
      "Image segmentation",
      "Object detection",
      "Pattern recognition"
    ],
    furtherReading: "Digital Image Processing by Gonzalez & Woods, Chapter 9",
    creativityCorner: "Use opening to remove 'salt-and-pepper' noise from an image. It can also be used to separate objects that are touching."
  },
  dilation: {
    theory: "Dilation is a morphological operation that is used to expand the boundaries of objects in an image. It is the opposite of erosion.",
    explanation: "Dilation is defined as the maximum of the values in a neighborhood. It is used to expand the boundaries of objects in an image and to fill small holes in an image.",
    applications: [
      "Image segmentation",
      "Object detection",
      "Pattern recognition"
    ],
    furtherReading: "Digital Image Processing by Gonzalez & Woods, Chapter 9",
    creativityCorner: "Use dilation to make objects in an image look 'bigger' or 'fatter'. It can also be used to connect broken lines or shapes."
  },
  erosion: {
    theory: "Erosion is a morphological operation that is used to shrink the boundaries of objects in an image. It is the opposite of dilation.",
    explanation: "Erosion is defined as the minimum of the values in a neighborhood. It is used to shrink the boundaries of objects in an image and to remove small objects from an image.",
    applications: [
      "Image segmentation",
      "Object detection",
      "Pattern recognition"
    ],
    furtherReading: "Digital Image Processing by Gonzalez & Woods, Chapter 9",
    creativityCorner: "Use erosion to make objects in an image look 'smaller' or 'thinner'. It can also be used to separate objects that are touching."
  },
  canny: {
    theory: "The Canny edge detector is an edge detection operator that uses a multi-stage algorithm to detect a wide range of edges in images.",
    explanation: "The Canny edge detector is a multi-stage algorithm that consists of the following steps: 1. Noise reduction, 2. Finding the intensity gradient of the image, 3. Non-maximum suppression, 4. Hysteresis thresholding.",
    applications: [
      "Edge detection",
      "Feature extraction",
      "Image segmentation"
    ],
    furtherReading: "Digital Image Processing by Gonzalez & Woods, Chapter 10",
    creativityCorner: "The Canny edge detector is great for creating a 'comic book' effect. Try combining the output with a color image to create a 'color splash' effect."
  },
  harris: {
    theory: "The Harris corner detector is a corner detection operator that is commonly used in computer vision algorithms to extract corners and infer features of an image.",
    explanation: "The Harris corner detector is a mathematical operator that finds corners in an image. It is based on the local auto-correlation function of a signal, where the local auto-correlation function measures the local changes of the signal with patches shifted by a small amount in different directions.",
    applications: [
      "Corner detection",
      "Feature extraction",
      "Image stitching"
    ],
    furtherReading: "Computer Vision: Algorithms and Applications by Richard Szeliski, Chapter 7",
    creativityCorner: "Use the Harris corner detector to find interesting points in an image. You can then use these points to create a 'constellation' effect or to generate abstract patterns."
  },
  hough_circles: {
    theory: "The Hough transform is a feature extraction technique used in image analysis, computer vision, and digital image processing. The purpose of the technique is to find imperfect instances of objects within a certain class of shapes by a voting procedure.",
    explanation: "The Hough transform can be used to detect circles in an image. The basic idea is to find circles in an image by voting for the center and radius of the circles.",
    applications: [
      "Circle detection",
      "Object detection",
      "Feature extraction"
    ],
    furtherReading: "Digital Image Processing by Gonzalez & Woods, Chapter 10",
    creativityCorner: "Use the Hough transform to find circular objects in an image, like bubbles or coins. You can then use these circles to create a 'pop art' effect or to generate abstract patterns."
  },
  hough_lines: {
    theory: "The Hough transform is a feature extraction technique used in image analysis, computer vision, and digital image processing. The purpose of the technique is to find imperfect instances of objects within a certain class of shapes by a voting procedure.",
    explanation: "The Hough transform can be used to detect lines in an image. The basic idea is to find lines in an image by voting for the parameters of the lines.",
    applications: [
      "Line detection",
      "Object detection",
      "Feature extraction"
    ],
    furtherReading: "Digital Image Processing by Gonzalez & Woods, Chapter 10",
    creativityCorner: "Use the Hough transform to find straight lines in an image, like roads or buildings. You can then use these lines to create a 'blueprint' effect or to generate abstract patterns."
  }
};

const defaultExplanation = {
  theory: "This transformation applies computer vision algorithms to modify pixel values based on mathematical operations.",
  explanation: "The specific algorithm processes each pixel according to its formula, which may consider neighboring pixels, statistical properties, or frequency domain characteristics.",
  applications: [
    "Image enhancement and restoration",
    "Feature extraction",
    "Computer vision systems"
  ],
  furtherReading: "Digital Image Processing by Gonzalez & Woods",
  creativityCorner: "The sky is the limit! Try combining this operation with others to create your own unique effects."
};

const Learn = () => {
  const [selectedTask, setSelectedTask] = useState<ProcessingTask | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const tasksByCategory = getTasksByCategory();

  const filteredTasks = useMemo(() => {
    if (!searchTerm) {
      return tasksByCategory;
    }

    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered: Record<string, ProcessingTask[]> = {};

    for (const category in tasksByCategory) {
      const tasks = tasksByCategory[category].filter(
        (task) =>
          task.name.toLowerCase().includes(lowercasedFilter) ||
          task.description.toLowerCase().includes(lowercasedFilter)
      );
      if (tasks.length > 0) {
        filtered[category] = tasks;
      }
    }
    return filtered;
  }, [searchTerm, tasksByCategory]);

  const handleSelectTask = (task: ProcessingTask) => {
    setSelectedTask(task);
  };

  const taskInfo = selectedTask ? explanations[selectedTask.id] || defaultExplanation : null;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-muted/20">
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  Explore Image Processing
                </h1>
                <p className="max-w-[800px] text-muted-foreground md:text-xl/relaxed">
                  A creative journey into the world of pixels.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1">
                <div className="sticky top-24">
                  <Input
                    placeholder="Search operations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-4"
                  />
                  <Card>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 gap-1">
                        {Object.keys(filteredTasks).map((category) => (
                          <div key={category}>
                            <h3 className="font-semibold text-lg capitalize mb-2 mt-4 px-2">{category}</h3>
                            {filteredTasks[category].map((task) => (
                              <button
                                key={task.id}
                                onClick={() => handleSelectTask(task)}
                                className={`w-full text-left p-2 rounded-md text-sm hover:bg-muted transition-colors ${selectedTask?.id === task.id ? 'bg-primary text-primary-foreground' : ''}`}
                              >
                                {task.name}
                              </button>
                            ))}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <div className="col-span-3">
                {taskInfo && selectedTask && (
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-2xl">{selectedTask.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible defaultValue="theory" className="w-full">
                        <AccordionItem value="theory">
                          <AccordionTrigger className="text-lg">The Gist</AccordionTrigger>
                          <AccordionContent className="text-base">
                            <p className="text-muted-foreground">{taskInfo.theory}</p>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="how-it-works">
                          <AccordionTrigger className="text-lg">Under the Hood</AccordionTrigger>
                          <AccordionContent className="text-base">
                            <p className="text-muted-foreground">{taskInfo.explanation}</p>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="applications">
                          <AccordionTrigger className="text-lg">Real-World Uses</AccordionTrigger>
                          <AccordionContent>
                            <ul className="list-disc pl-6 text-muted-foreground text-base">
                              {taskInfo.applications.map((app, index) => (
                                <li key={index} className="mb-1">{app}</li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="creativity-corner">
                          <AccordionTrigger className="text-lg">Creativity Corner</AccordionTrigger>
                          <AccordionContent className="text-base">
                            <p className="text-muted-foreground">{taskInfo.creativityCorner}</p>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="further-reading">
                          <AccordionTrigger className="text-lg">Dive Deeper</AccordionTrigger>
                          <AccordionContent className="text-base">
                            <p className="text-muted-foreground">{taskInfo.furtherReading}</p>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>
                )}
                 {!selectedTask && (
                    <div className="flex flex-col items-center justify-center h-full bg-background rounded-lg shadow-inner p-12">
                        <h2 className="text-2xl font-semibold text-muted-foreground">Select an operation</h2>
                        <p className="text-muted-foreground mt-2">...and let the learning begin!</p>
                    </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Learn;
