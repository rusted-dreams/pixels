
const Footer = () => {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex flex-col items-center justify-center gap-4 px-4 md:flex-row md:gap-8">
        <p className="text-center text-sm leading-loose text-muted-foreground">
          Built for educational purposes. The perfect companion for learning image
          processing with OpenCV.
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <a href="#" className="underline hover:text-foreground">
            Terms
          </a>
          <a href="#" className="underline hover:text-foreground">
            Privacy
          </a>
          <a href="#" className="underline hover:text-foreground">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
