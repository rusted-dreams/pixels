import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-b from-background to-muted/30">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Learn Image Processing Visually
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    PixelLab is an educational platform for students and
                    educators to explore image processing concepts through
                    interactive visualization.
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
                  className="rounded-md bg-primary/40 h-full w-full shadow-2xl"
                  src="/ai-generated-8860534_1280.jpg"
                  alt=""
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
                  Understand Image Processing Intuitively
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform makes complex concepts accessible through visual
                  learning and interactive experiments.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-2xl font-bold">1</span>
                    </div>
                    <h3 className="text-xl font-bold">Upload</h3>
                    <p className="text-center text-muted-foreground">
                      Simply upload an image from your local machine to get
                      started
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-2xl font-bold">2</span>
                    </div>
                    <h3 className="text-xl font-bold">Process</h3>
                    <p className="text-center text-muted-foreground">
                      Apply various OpenCV transformations with a single click
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-2xl font-bold">3</span>
                    </div>
                    <h3 className="text-xl font-bold">Compare</h3>
                    <p className="text-center text-muted-foreground">
                      Analyze side-by-side results to understand transformations
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
                  Explore Image Transformations
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  From basic filters to advanced edge detection algorithms, our
                  platform covers a wide range of operations.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {transformationPreviews.map((transform) => (
                <Card key={transform.name} className="overflow-hidden">
                  <img
                    className="aspect-square bg-muted/50"
                    src={transform.image}
                  />
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{transform.name}</h3>
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
        <section className="py-20 bg-primary">
          <div className="container px-4 md:px-6 text-primary-foreground">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Ready to Start Learning?
                </h2>
                <p className="max-w-[600px] md:text-xl/relaxed">
                  Jump into our interactive lab and begin experimenting with
                  image processing techniques.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
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
