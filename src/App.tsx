import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import Index from "./pages/Index";
import CancellationRefunds from "./pages/CancellationRefunds";
import TermsAndConditions from "./pages/TermsAndConditions";
import Privacy from "./pages/Privacy";
import Contact from "./pages/Contact";
import Pricing from "./pages/Pricing";
import Upgrade from "./pages/Upgrade";

// Configure the query client with retries and error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* Redirect /index to / */}
            <Route path="/index" element={<Navigate to="/" replace />} />
            <Route path="/cancellation-refunds" element={<CancellationRefunds />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/upgrade" element={<Upgrade />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<div style={{color: 'white', textAlign: 'center', marginTop: '2rem'}}>Page not found.</div>} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
