import { Link } from "@/components/RouterLink";
import { useEffect } from "react";

const NotFound = () => {
  useEffect(() => {
    console.error("404 Error: Page not found");
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-primary">404</h1>
        <p className="mb-8 text-2xl text-foreground">Page not found</p>
        <Link to="/" className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg transition-all">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;