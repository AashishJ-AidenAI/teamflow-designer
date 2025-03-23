
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Bot, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center max-w-md px-4">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Bot className="h-10 w-10 text-primary" />
          </div>
        </div>
        
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-team mb-4">
          404
        </h1>
        
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        
        <p className="text-muted-foreground mb-8">
          The page you were looking for doesn't exist or has been moved.
          Please check the URL or return to the home page.
        </p>
        
        <Button asChild size="lg" className="gap-2">
          <a href="/">
            <Home className="h-4 w-4" />
            Back to Home
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
