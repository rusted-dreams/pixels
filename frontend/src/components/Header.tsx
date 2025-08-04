
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { GithubIcon, BookOpen, Info, Microscope } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <Microscope className="h-6 w-6" />
          <span className="font-bold text-xl">PixelLab</span>
        </Link>
        <nav className="hidden md:flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link to="/learn">
              <BookOpen className="h-4 w-4 mr-2" />
              Learn
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/documentation">
              <Info className="h-4 w-4 mr-2" />
              Documentation
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/about">
              <Info className="h-4 w-4 mr-2" />
              About
            </Link>
          </Button>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <a href="https://github.com/rusted-dreams/pixels" target="_blank" rel="noopener noreferrer">
              <GithubIcon className="h-4 w-4 mr-2" />
              GitHub
            </a>
          </Button>
          <Button asChild>
            <Link to="/lab">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
