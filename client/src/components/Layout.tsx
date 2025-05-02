import Header from "./Header";
import Footer from "./Footer";
import { Suspense, ReactNode } from "react";

// Loading fallback component
const LoadingContent = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center">
      <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-muted-foreground">Loading content...</p>
    </div>
  </div>
);

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <Suspense fallback={<LoadingContent />}>
          {children}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
