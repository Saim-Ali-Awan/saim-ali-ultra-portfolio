import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SITE_DESCRIPTION, SITE_TITLE, setPageMeta } from "./lib/site";
// ── NEW: global haptics engine ────────────────────────────────
import { initHaptics } from "./lib/haptics";
import NotFound from "./pages/NotFound";
import  Home from "./pages/Home";

function Router() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (location === "/") {
      setPageMeta(SITE_TITLE, SITE_DESCRIPTION, "/");
    }
  }, [location]);

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  // ── NEW: button-tap haptics + 5s-idle double haptic, site-wide ──
  useEffect(() => initHaptics({ idleTimeoutMs: 5000 }), []);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable={false}>
        <TooltipProvider>
          <Toaster />
          <Suspense fallback={null}>
            <Router />
          </Suspense>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}