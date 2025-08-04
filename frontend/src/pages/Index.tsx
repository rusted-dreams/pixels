import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { UploadIcon, CpuIcon, GitCompareIcon } from "lucide-react";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-b from-background to-muted/30">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_650px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                    The Universe of Pixels,
                    <br />
                    <span className="text-primary">At Your Fingertips.</span>
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    An educational platform for students and educators to explore image processing concepts through interactive visualization.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild>
                    <a href="/lab">Start Processing</a>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a href="#features">Learn More</a>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  className="rounded-xl bg-primary/40 h-full w-full shadow-2xl"
                  src="/ai-generated-8860534_1280.jpg"
                  alt="Hero Image"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  A New Way to Learn
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform is designed to make learning image processing intuitive, engaging, and fun.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <UploadIcon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">Upload with Ease</h3>
                    <p className="text-center text-muted-foreground">
                      Drag and drop your images to start the magic.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <CpuIcon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">Process in Real-Time</h3>
                    <p className="text-center text-muted-foreground">
                      Apply a wide range of transformations and see the results instantly.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <GitCompareIcon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">Compare and Contrast</h3>
                    <p className="text-center text-muted-foreground">
                      Analyze the before and after to deepen your understanding.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Transformations Section */}
        <section className="py-20 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  A World of Transformations
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform supports a wide variety of image processing operations, from simple filters to complex algorithms.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-2 lg:grid-cols-3">
              {transformationPreviews.map((transform) => (
                <Card key={transform.name} className="overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                  <div className="overflow-hidden">
                    <img
                      className="aspect-video w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      src={transform.image}
                      alt={transform.name}
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg">{transform.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {transform.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-center">
              <Button size="lg" asChild className="mt-8">
                <a href="/lab">Try It Yourself</a>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Unlock Your Potential
                </h2>
                <p className="max-w-[600px] md:text-xl/relaxed">
                  Ready to dive in? The lab is where the magic happens.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row mt-4">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-background text-foreground hover:bg-background/90"
                  asChild
                >
                  <a href="/lab">Enter the Lab</a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

// Sample transformation previews
const transformationPreviews = [
  {
    name: "Image Negative",
    image: "/negative.jpg",
    description: "Invert all pixel values in an image",
  },
  {
    name: "RGB Channels",
    image: "/rgbt.jpg",
    description: "Separate the red, green, and blue channels",
  },
  {
    name: "Grayscale",
    image: "/gryscale.jpeg",
    description: "Convert color images to black and white",
  },
  {
    name: "Gaussian Blur",
    image: "/Effects-GaussianBlur.png",
    description: "Reduce noise and detail in images",
  },
  {
    name: "Sobel Edge Detection",
    image: "/sobel_1.jpg",
    description: "Highlight edges in an image",
  },
  {
    name: "Noise Removal",
    image: "/noise_removal.png",
    description: "Clean up images with various noise types",
  },
];

export default Index;
