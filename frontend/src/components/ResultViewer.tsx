
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ResultViewerProps {
  originalImage: string;
  processedResult: {
    type: "image" | "zip";
    url: string;
    filename: string;
  } | null;
  isZipResult?: boolean;
  zipContents?: Array<{ name: string; url: string }>;
}

const ResultViewer = ({
  originalImage,
  processedResult,
  isZipResult = false,
  zipContents = [],
}: ResultViewerProps) => {
  const [selectedZipImage, setSelectedZipImage] = useState<string | null>(
    zipContents.length > 0 ? zipContents[0].name : null
  );

  // Helper function to download an image
  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Results Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Original Image */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-lg">Original Image</h3>
            </div>
            <div className="border rounded-md p-2 bg-muted/30 min-h-[250px] flex items-center justify-center">
              {originalImage && (
                <img
                  src={originalImage}
                  alt="Original"
                  className="max-w-full max-h-[400px] object-contain rounded"
                />
              )}
            </div>
          </div>

          {/* Processed Result */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-lg">Processed Result</h3>
              {processedResult && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() =>
                    downloadImage(processedResult.url, processedResult.filename)
                  }
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              )}
            </div>

            {isZipResult && zipContents.length > 0 ? (
              <div className="space-y-4">
                <Tabs defaultValue={zipContents[0].name}>
                  <TabsList className="w-full grid grid-cols-3">
                    {zipContents.map((item) => (
                      <TabsTrigger
                        key={item.name}
                        value={item.name}
                        onClick={() => setSelectedZipImage(item.name)}
                      >
                        {item.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {zipContents.map((item) => (
                    <TabsContent key={item.name} value={item.name} className="mt-2">
                      <div className="border rounded-md p-2 bg-muted/30 min-h-[250px] flex items-center justify-center">
                        <img
                          src={item.url}
                          alt={item.name}
                          className="max-w-full max-h-[400px] object-contain rounded"
                        />
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            ) : (
              <div className="border rounded-md p-2 bg-muted/30 min-h-[250px] flex items-center justify-center">
                {processedResult ? (
                  <img
                    src={processedResult.url}
                    alt="Processed"
                    className="max-w-full max-h-[400px] object-contain rounded"
                  />
                ) : (
                  <p className="text-muted-foreground">
                    No processed image yet
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultViewer;
