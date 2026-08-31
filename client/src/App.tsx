import { useState } from "react";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { trpc } from "./lib/trpc";
import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import NotFound from "./pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

// Import studio pages safely to prevent module crash if individual exports are missing
import * as StudioPages from "./pages/StudioPages";

const SafePage = ({ title }: { title: string }) => (
  <div style={{ padding: "4rem", textAlign: "center", color: "#fff" }}>
    <h1>{title}</h1>
    <p>Page component loading...</p>
  </div>
);

const AboutPage = StudioPages?.AboutPage || (() => <SafePage title="About" />);
const PortfolioPage = StudioPages?.PortfolioPage || (() => <SafePage title="Portfolio" />);
const TechStackPage = StudioPages?.TechStackPage || (() => <SafePage title="Tech Stack" />);
const ContactPage = StudioPages?.ContactPage || (() => <SafePage title="Contact" />);

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={AboutPage} />
      <Route path="/portfolio" component={PortfolioPage} />
      <Route path="/techstack" component={TechStackPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url:
            typeof window !== "undefined"
              ? `${window.location.origin}/api/trpc`
              : "/api/trpc",
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <ThemeProvider defaultTheme="dark" switchable>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </QueryClientProvider>
    </trpc.Provider>
  );
}