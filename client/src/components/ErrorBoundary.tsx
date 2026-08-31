import React, { Component, ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const errorMessage =
        this.state.error?.stack ||
        this.state.error?.message ||
        String(this.state.error);

      return (
        <div className="flex items-center justify-center min-h-screen p-8 bg-background text-foreground">
          <div className="flex flex-col items-center w-full max-w-2xl p-8 border rounded-xl bg-card text-card-foreground shadow-lg">
            <AlertTriangle
              size={48}
              className="text-destructive mb-6 flex-shrink-0"
            />

            <h2 className="text-xl font-semibold mb-4 text-center">
              An unexpected error occurred.
            </h2>

            <div className="p-4 w-full rounded bg-muted overflow-auto mb-6 max-h-96 border">
              <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono">
                {errorMessage}
              </pre>
            </div>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 cursor-pointer transition-opacity font-medium"
            >
              <RotateCcw size={16} />
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;