
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Homepage from "./pages/Homepage";
import NotFound from "./pages/NotFound";
import ArticleView from "./pages/ArticleView";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Cookies from "./pages/Cookies";
import StartupProfile from "./pages/StartupProfile";

const queryClient = new QueryClient();

const App = () => {
  // Initialize theme from localStorage or system preference
  const [theme, setTheme] = useState<string | null>(null);

  useEffect(() => {
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  // Apply the theme class to the html element
  useEffect(() => {
    if (theme) {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme]);

  // Don't render until we've determined the theme to avoid flashing
  if (theme === null) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/archive" element={<NotFound />} />
            <Route path="/startups" element={<NotFound />} />
            <Route path="/startup/:slug" element={<StartupProfile />} />
            <Route path="/startups/:category" element={<NotFound />} />
            <Route path="/editors-picks" element={<NotFound />} />
            <Route path="/case-studies" element={<NotFound />} />
            <Route path="/case-studies/:category" element={<NotFound />} />
            <Route path="/funding" element={<NotFound />} />
            <Route path="/ai" element={<NotFound />} />
            <Route path="/about" element={<NotFound />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/article/:slug" element={<ArticleView />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
