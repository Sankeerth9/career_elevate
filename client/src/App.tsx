import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import NotFound from "@/pages/not-found";

// Lazy-loaded pages for better performance
const Home = lazy(() => import("@/pages/home"));
const Login = lazy(() => import("@/pages/login"));
const Register = lazy(() => import("@/pages/register"));
const Payment = lazy(() => import("@/pages/payment"));
const CareerAssessment = lazy(() => import("@/pages/career-assessment"));
const ExploreCareers = lazy(() => import("@/pages/explore-careers"));
const EducationalPathways = lazy(() => import("@/pages/educational-pathways"));
const JobListings = lazy(() => import("@/pages/job-listings"));
const CareerDetails = lazy(() => import("@/pages/career-details"));
const AIRecommendations = lazy(() => import("@/pages/ai-recommendations"));

// Loading fallback component
const Loading = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center">
      <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-lg text-foreground">Loading...</p>
    </div>
  </div>
);

function Router() {
  // We'll create a protected route component later if needed
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="payment" element={<Payment />} /> {/* Will handle auth check in component */}
          <Route path="career-assessment" element={<CareerAssessment />} />
          <Route path="explore-careers" element={<ExploreCareers />} />
          <Route path="educational-pathways" element={<EducationalPathways />} />
          <Route path="job-listings" element={<JobListings />} />
          <Route path="career/:id" element={<CareerDetails />} />
          <Route path="ai-recommendations" element={<AIRecommendations />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

function App() {
  return <Router />;
}

export default App;
