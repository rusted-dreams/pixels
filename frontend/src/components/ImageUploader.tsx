
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Image, X } from "lucide-react";

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
  multiple?: boolean;
}

const ImageUploader = ({ onImageSelected, multiple = false }: ImageUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const file = files[0];
    
    // Create preview
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
    setFileName(file.name);
    
    // Pass file to parent component
    onImageSelected(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    setPreviewUrl(null);
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div
          className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-md p-8 transition-colors ${
            dragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25"
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {!previewUrl ? (
            <>
              <Upload className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">
                Drag & drop your image here
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                PNG, JPG or JPEG up to 10MB
              </p>
              <Button onClick={handleButtonClick} variant="outline">
                <Upload className="mr-2" size={16} />
                Browse files
              </Button>
            </>
          ) : (
            <div className="relative w-full h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Image className="h-5 w-5 mr-2" />
                  <span className="text-sm font-medium truncate max-w-[200px]">
                    {fileName}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={clearImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-64 max-w-full mx-auto rounded-md object-contain"
              />
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleChange}
            multiple={multiple}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageUploader;
