import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AccessibilityToolbar from "@/components/AccessibilityToolbar";
import Index from "./pages/Index";
import AntiDiscrimination from "./pages/AntiDiscrimination";
import DisabilityRights from "./pages/DisabilityRights";
import WorkplaceRights from "./pages/WorkplaceRights";
import Organizations from "./pages/Organizations";
import Lawyers from "./pages/Lawyers";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AccessibilityProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/anti-discrimination" element={<AntiDiscrimination />} />
                  <Route path="/disability-rights" element={<DisabilityRights />} />
                  <Route path="/workplace-rights" element={<WorkplaceRights />} />
                  <Route path="/organizations" element={<Organizations />} />
                  <Route path="/lawyers" element={<Lawyers />} />
                  <Route path="/about" element={<About />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
            <AccessibilityToolbar />
          </BrowserRouter>
        </TooltipProvider>
      </AccessibilityProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
