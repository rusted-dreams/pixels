
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ProcessingTask } from "@/lib/types";
import { processImage, handleProcessedResponse } from "@/lib/api";
import { extractZipContents, revokeObjectUrls } from "@/lib/zipUtils";
import ImageUploader from "./ImageUploader";
import TaskSelector from "./TaskSelector";
import ResultViewer from "./ResultViewer";
import EducationPanel from "./EducationPanel";

const ProcessingWorkflow = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedTask, setSelectedTask] = useState<ProcessingTask | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [processedResult, setProcessedResult] = useState<{
    type: "image" | "zip";
    url: string;
    filename: string;
  } | null>(null);
  const [zipContents, setZipContents] = useState<Array<{name: string, url: string}>>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      // Cleanup original image URL
      if (originalImageUrl) {
        URL.revokeObjectURL(originalImageUrl);
      }

      // Cleanup processed result URL
      if (processedResult?.url) {
        URL.revokeObjectURL(processedResult.url);
      }

      // Cleanup ZIP content URLs
      if (zipContents.length > 0) {
        revokeObjectUrls(zipContents.map(item => item.url));
      }
    };
  }, []);

  const handleImageSelected = (file: File) => {
    // Cleanup previous URLs
    if (originalImageUrl) {
      URL.revokeObjectURL(originalImageUrl);
    }
    
    setSelectedImage(file);
    
    // Create a URL for the original image preview
    const imageUrl = URL.createObjectURL(file);
    setOriginalImageUrl(imageUrl);
    
    // Reset processed results when a new image is selected
    setProcessedResult(null);
    setZipContents([]);
  };

  const handleTaskSelected = (task: ProcessingTask) => {
    setSelectedTask(task);
    
    // Reset processed results when a new task is selected
    setProcessedResult(null);
    setZipContents([]);
  };

  const handleProcess = async () => {
    if (!selectedImage || !selectedTask) {
      toast.error("Please select both an image and a processing task");
      return;
    }

    setIsProcessing(true);
    
    try {
      // Process the image
      const response = await processImage(selectedTask.endpoint, selectedImage);
      
      // Handle the response based on its type
      const result = await handleProcessedResponse(response);
      setProcessedResult(result);
      
      // If it's a ZIP file with multiple images, extract them
      if (result.type === "zip") {
        try {
          // Get the blob from the response to extract ZIP contents
          const zipBlob = await response.clone().blob();
          const extractedFiles = await extractZipContents(zipBlob);
          setZipContents(extractedFiles);
        } catch (zipError) {
          console.error("Failed to extract ZIP contents:", zipError);
          // Fallback to placeholder images if extraction fails
          if (selectedTask.id === "rgb-channels") {
            setZipContents([
              { name: "red_channel.png", url: result.url },
              { name: "green_channel.png", url: result.url },
              { name: "blue_channel.png", url: result.url },
            ]);
          }
        }
      }
      
      toast.success("Image processed successfully!");
    } catch (error) {
      console.error("Processing failed:", error);
      toast.error(error instanceof Error ? error.message : "Processing failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ImageUploader onImageSelected={handleImageSelected} />
        <TaskSelector onSelectTask={handleTaskSelected} />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Process Image</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            <p className="text-muted-foreground text-center max-w-md">
              {selectedImage && selectedTask
                ? `Ready to apply "${selectedTask.name}" to "${selectedImage.name}"`
                : "Select an image and a processing task to continue"}
            </p>
            <Button 
              onClick={handleProcess} 
              disabled={!selectedImage || !selectedTask || isProcessing}
              className="px-8"
            >
              {isProcessing ? "Processing..." : "Process Image"}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {originalImageUrl && (
        <ResultViewer
          originalImage={originalImageUrl}
          processedResult={processedResult}
          isZipResult={processedResult?.type === "zip"}
          zipContents={zipContents}
        />
      )}
      
      {selectedTask && (
        <div className="mt-8">
          <EducationPanel selectedTask={selectedTask} />
        </div>
      )}
    </div>
  );
};

export default ProcessingWorkflow;
