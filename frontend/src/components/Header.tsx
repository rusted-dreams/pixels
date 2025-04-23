
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="border-b">
      <div className="container flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-2">
          <div className="font-bold text-xl">PixelLab</div>
          <div className="hidden md:block text-sm text-muted-foreground">
            Educational Image Processing
          </div>
        </div>
        <nav className="flex items-center gap-4">
          <Button variant="ghost" className="text-sm">
            Learn
          </Button>
          <Button variant="ghost" className="text-sm">
            Documentation
          </Button>
          <Button variant="ghost" className="text-sm">
            About
          </Button>
          <Button className="hidden md:inline-flex">Get Started</Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
