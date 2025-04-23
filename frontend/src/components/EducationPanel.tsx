
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProcessingTask } from "@/lib/types";

interface EducationPanelProps {
  selectedTask: ProcessingTask | null;
}

interface TaskExplanation {
  [key: string]: {
    theory: string;
    explanation: string;
    applications: string[];
    furtherReading: string;
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
    furtherReading: "Digital Image Processing by Gonzalez & Woods, Chapter 3.2"
  },
  "rgb-channels": {
    theory: "Color images typically store RGB (Red, Green, Blue) values for each pixel. Separating these channels allows analysis of each color component independently.",
    explanation: "Each pixel in a color image is represented as a combination of red, green, and blue intensities. Channel separation extracts each component into separate grayscale images.",
    applications: [
      "Color correction and balancing",
      "Feature detection in specific color ranges",
      "Color-based segmentation"
    ],
    furtherReading: "Fundamentals of Digital Image Processing by Anil K. Jain, Chapter 4"
  },
  grayscale: {
    theory: "Grayscale conversion reduces a color image to shades of gray, eliminating color information while preserving luminance.",
    explanation: "The standard formula is: Gray = 0.299×Red + 0.587×Green + 0.114×Blue. This formula accounts for human perception of brightness in different colors.",
    applications: [
      "Preprocessing for many computer vision algorithms",
      "Reducing computational complexity",
      "Emphasizing texture and shape over color"
    ],
    furtherReading: "Computer Vision: Algorithms and Applications by Richard Szeliski, Section 2.3"
  },
  sobel: {
    theory: "Sobel edge detection uses gradient calculations to highlight regions of high spatial frequency, which often correspond to edges in images.",
    explanation: "It applies two 3×3 kernels to calculate approximations of derivatives - one for horizontal changes and one for vertical. The combined magnitude reveals edges.",
    applications: [
      "Object boundary detection",
      "Feature extraction",
      "Image segmentation preprocessing"
    ],
    furtherReading: "Digital Image Processing Using MATLAB by Gonzalez, Woods & Eddins, Chapter 6"
  }
};

// Default explanation for tasks without specific content
const defaultExplanation = {
  theory: "This transformation applies computer vision algorithms to modify pixel values based on mathematical operations.",
  explanation: "The specific algorithm processes each pixel according to its formula, which may consider neighboring pixels, statistical properties, or frequency domain characteristics.",
  applications: [
    "Image enhancement and restoration",
    "Feature extraction",
    "Computer vision systems"
  ],
  furtherReading: "Digital Image Processing by Gonzalez & Woods"
};

const EducationPanel = ({ selectedTask }: EducationPanelProps) => {
  if (!selectedTask) {
    return null;
  }

  const taskInfo = explanations[selectedTask.id] || defaultExplanation;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning Resources: {selectedTask.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="theory">
            <AccordionTrigger>Theory</AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">{taskInfo.theory}</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="how-it-works">
            <AccordionTrigger>How It Works</AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">{taskInfo.explanation}</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="applications">
            <AccordionTrigger>Applications</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-6 text-muted-foreground">
                {taskInfo.applications.map((app, index) => (
                  <li key={index}>{app}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="further-reading">
            <AccordionTrigger>Further Reading</AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">{taskInfo.furtherReading}</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default EducationPanel;
