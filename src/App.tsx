
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Homepage from "./pages/Homepage";
import NotFound from "./pages/NotFound";
import ArticleView from "./pages/ArticleView";
import ArticlePage from "./pages/ArticlePage";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Cookies from "./pages/Cookies";
import StartupProfile from "./pages/StartupProfile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Careers from "./pages/Careers";
import ExploreStartups from "./pages/ExploreStartups";
import Subscribe from "./pages/Subscribe";
import AI from "./pages/AI";
import CaseStudies from "./pages/CaseStudies";
import Funding from "./pages/Funding";
import Startups from "./pages/Startups";

// Create a QueryClient instance outside of the component
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
      <div className="app-container">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/startups" element={<Startups />} />
              <Route path="/startup/:slug" element={<StartupProfile />} />
              <Route path="/startups/:category" element={<Startups />} />
              <Route path="/case-studies" element={<CaseStudies />} />
              <Route path="/case-studies/:category" element={<CaseStudies />} />
              <Route path="/funding" element={<Funding />} />
              <Route path="/ai" element={<AI />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/cookies" element={<Cookies />} />
              <Route path="/explore-startups" element={<ExploreStartups />} />
              <Route path="/subscribe" element={<Subscribe />} />
              <Route path="/article/:slug" element={<ArticlePage />} />
              <Route path="/article/old/:slug" element={<ArticleView />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </div>
    </QueryClientProvider>
  );
};

export default App;
