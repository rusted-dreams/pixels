import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Documentation = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-muted/20">
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  Documentation
                </h1>
                <p className="max-w-[800px] text-muted-foreground md:text-xl/relaxed">
                  Everything you need to know to use PixelLab.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Introduction</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p>
                    PixelLab is an interactive educational platform designed to help you learn about image processing. You can upload your own images, apply various transformations, and see the results in real-time. The platform also provides detailed explanations of the underlying concepts for each operation.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Getting Started</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>
                      <strong>Navigate to the Lab:</strong> Click on the "Get Started" button in the header or the "Enter the Lab" button on the homepage to go to the image processing lab.
                    </li>
                    <li>
                      <strong>Upload an Image:</strong> You can either drag and drop an image into the designated area or click to select a file from your computer. For tasks that require multiple images, you can upload multiple files.
                    </li>
                    <li>
                      <strong>Select a Task:</strong> Choose an image processing operation from the list of available tasks. The tasks are organized by category to make them easier to find.
                    </li>
                    <li>
                      <strong>Adjust Parameters:</strong> Some tasks have parameters that you can adjust to change the outcome of the operation. Use the sliders and input fields to set the parameters to your liking.
                    </li>
                    <li>
                      <strong>Process the Image:</strong> Click the "Process Image" button to apply the selected transformation to your image.
                    </li>
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">The Lab</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p>
                    The lab is where all the magic happens. It consists of several components:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>
                      <strong>Image Uploader:</strong> This is where you upload your image(s).
                    </li>
                    <li>
                      <strong>Task Selector:</strong> This component allows you to choose the image processing operation you want to apply.
                    </li>
                    <li>
                      <strong>Task Parameters:</strong> If the selected task has adjustable parameters, they will appear here.
                    </li>
                    <li>
                      <strong>Result Viewer:</strong> This is where you can see the original and processed images side-by-side.
                    </li>
                    <li>
                      <strong>Education Panel:</strong> This panel provides detailed information about the selected task, including the theory behind it, how it works, and its real-world applications.
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Learning Resources</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p>
                    The "Learn" page is a dedicated section for exploring the concepts behind the various image processing techniques available on the platform. You can browse through the different operations, read about the theory and applications, and even get ideas for creative projects in the "Creativity Corner".
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Documentation;
