import { Suspense, lazy } from "react";
import { Route, Switch, Router as WouterRouter } from "wouter";
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
const AssessmentResults = lazy(() => import("@/pages/career-assessment/results/[id]"));
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
      <Layout>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/payment" component={Payment} /> {/* Will handle auth check in component */}
          <Route path="/career-assessment" component={CareerAssessment} />
          <Route path="/career-assessment/results/:id" component={AssessmentResults} />
          <Route path="/explore-careers" component={ExploreCareers} />
          <Route path="/educational-pathways/:id" component={EducationalPathways} />
          <Route path="/educational-pathways" component={EducationalPathways} />
          <Route path="/job-listings" component={JobListings} />
          <Route path="/career/:id" component={CareerDetails} />
          <Route path="/ai-recommendations" component={AIRecommendations} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </Suspense>
  );
}

function App() {
  return (
    <WouterRouter>
      <Router />
    </WouterRouter>
  );
}

export default App;
