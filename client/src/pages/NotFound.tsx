import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { AlertCircle, Home } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  const handleGoHome = () => {
    setLocation("/");
  };

  return (
    <main className="zajno-shell">
      <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0c] text-white px-4">
        <Card className="w-full max-w-lg shadow-2xl border border-white/10 bg-[#121216]/80 backdrop-blur-md rounded-2xl overflow-hidden">
          <CardContent className="pt-10 pb-10 px-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-[#D8FE3E]/20 rounded-full animate-pulse filter blur-md" />
                <AlertCircle className="relative h-16 w-16 text-[#D8FE3E]" />
              </div>
            </div>

            <div className="studio-label mb-2">404 ERROR</div>

            <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
              Page Not Found
            </h1>

            <p className="text-zinc-400 mb-8 leading-relaxed text-sm sm:text-base">
              Sorry, the page you are looking for doesn't exist.
              <br />
              It may have been moved or deleted.
            </p>

            <div
              id="not-found-button-group"
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Button
                onClick={handleGoHome}
                data-cursor="GO"
                className="bg-[#D8FE3E] hover:bg-[#c4ea2b] text-[#0a0a0c] px-6 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg font-medium flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Back to Main Page 
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}