
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProcessingWorkflow from "@/components/ProcessingWorkflow";

const Lab = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <section className="py-10">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Image Processing Lab
                </h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                  Upload an image, select a transformation, and see the results instantly.
                </p>
              </div>
            </div>

            <ProcessingWorkflow />
            
            <div className="mt-20 mb-10 text-center">
              <h2 className="text-2xl font-bold mb-4">How to Use This Lab</h2>
              <div className="max-w-3xl mx-auto">
                <p className="text-muted-foreground mb-4">
                  This interactive lab allows you to experiment with various image processing 
                  techniques to better understand computer vision concepts:
                </p>
                <ol className="text-left list-decimal pl-6 space-y-2 text-muted-foreground">
                  <li><strong>Upload an image</strong> from your device using the uploader.</li>
                  <li><strong>Select a processing task</strong> from the available categories.</li>
                  <li><strong>Process the image</strong> and observe the transformation results.</li>
                  <li><strong>Compare the original and processed images</strong> side by side.</li>
                  <li><strong>Learn more</strong> about each transformation from the educational materials.</li>
                </ol>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Lab;
