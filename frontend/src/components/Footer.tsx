
import { GithubIcon } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} PixelLab. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <a href="https://github.com/rusted-dreams/pixels" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
            <GithubIcon className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
