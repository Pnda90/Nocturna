import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@/components/Header";
import LandingPage from "./pages/LandingPage";
import OuijaPage from "./pages/OuijaPage";
import StoriesPage from "./pages/StoriesPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import { useAppStore } from "@/lib/store";
import { MotionConfig } from "framer-motion";
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  const reduceMotion = useAppStore((state) => state.reduceMotion);
  const language = useAppStore((state) => state.language);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      useAppStore.getState().setReduceMotion(true);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MotionConfig reducedMotion={reduceMotion ? "always" : "user"}>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <div className={`min-h-screen bg-background ${reduceMotion ? "reduce-motion" : ""}`}>
              <Header />
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/ouija" element={<OuijaPage />} />
                <Route path="/stories" element={<StoriesPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </MotionConfig>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
