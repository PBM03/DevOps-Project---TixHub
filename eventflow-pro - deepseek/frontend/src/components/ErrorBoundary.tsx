import { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface State { error: Error | null }

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(error: Error) { console.error("ErrorBoundary:", error); }
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen grid place-items-center p-6 text-center">
          <div className="space-y-4 max-w-md">
            <h1 className="font-display text-3xl font-bold">Something went wrong</h1>
            <p className="text-sm text-muted-foreground">{this.state.error.message}</p>
            <Button onClick={() => location.assign("/")} className="gradient-primary border-0">
              Go home
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
