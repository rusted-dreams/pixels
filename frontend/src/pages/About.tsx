import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-muted/20">
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  About PixelLab
                </h1>
                <p className="max-w-[800px] text-muted-foreground md:text-xl/relaxed">
                  Pixel by pixel, we're making image processing accessible to everyone.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Our Mission</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p>
                    Our mission is to demystify the world of image processing. We believe that learning should be a hands-on, engaging experience. PixelLab was created to provide a platform where students, educators, and enthusiasts can experiment with computer vision concepts in an intuitive and playful way. We want to empower the next generation of engineers and artists to create amazing things with pixels.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Our Story</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p>
                    PixelLab started as a small project in a university lab. A group of students, frustrated with the lack of interactive tools for learning image processing, decided to build their own. What began as a simple tool for visualizing transformations quickly grew into a comprehensive platform with a wide range of operations and educational resources. Today, PixelLab is used by thousands of learners around the world.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Meet the Team</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="w-24 h-24 mb-4">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>SM</AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold text-lg">Shubhomkar Mahato</h3>
                    <a href="https://www.linkedin.com/in/shubhomkar-mahato" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline mt-1">shubhomkar-mahato</a>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="w-24 h-24 mb-4">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>YG</AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold text-lg">Yash Gupta</h3>
                    <a href="https://www.linkedin.com/in/yash-gupta15" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline mt-1">yash-gupta15</a>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="w-24 h-24 mb-4">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>MMJ</AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold text-lg">Mridul Madhav Jindal</h3>
                    <a href="https://www.linkedin.com/in/mridul-madhav-jindal-91bb49253" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline mt-1">mridul-madhav-jindal-91bb49253</a>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Contact Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="grid grid-cols-1 gap-4">
                    <Input placeholder="Name" />
                    <Input type="email" placeholder="Email" />
                    <Textarea placeholder="Message" />
                    <Button>Send Message</Button>
                  </form>
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

export default About;
