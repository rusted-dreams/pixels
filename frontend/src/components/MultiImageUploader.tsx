
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Image, X, Plus } from "lucide-react";

interface MultiImageUploaderProps {
  onImagesSelected: (files: File[]) => void;
  maxImages?: number;
}

const MultiImageUploader = ({ 
  onImagesSelected, 
  maxImages = 2 
}: MultiImageUploaderProps) => {
  const [images, setImages] = useState<Array<{ file: File; preview: string }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      if (images.length >= maxImages) {
        alert(`Maximum ${maxImages} images allowed`);
        return;
      }
      
      // Create preview URL
      const preview = URL.createObjectURL(file);
      
      // Add to images array
      const newImages = [...images, { file, preview }];
      setImages(newImages);
      
      // Pass files to parent component
      onImagesSelected(newImages.map(img => img.file));
      
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = (index: number) => {
    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(images[index].preview);
    
    // Remove image from array
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    // Pass updated files to parent component
    onImagesSelected(newImages.map(img => img.file));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Multiple Images (Max: {maxImages})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Image preview cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((image, index) => (
              <div 
                key={index} 
                className="border rounded-md p-3 relative"
              >
                <button
                  className="absolute top-2 right-2 bg-background/80 rounded-full p-1"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="flex flex-col items-center">
                  <img 
                    src={image.preview} 
                    alt={`Image ${index + 1}`}
                    className="h-32 object-contain mb-2"
                  />
                  <p className="text-sm text-center truncate max-w-full">
                    {image.file.name}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Add image button */}
            {images.length < maxImages && (
              <button
                className="border border-dashed rounded-md p-3 h-full flex flex-col items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
                onClick={handleAddImage}
              >
                <Plus className="h-8 w-8 mb-2" />
                <span>Add Image</span>
              </button>
            )}
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/jpg"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MultiImageUploader;
