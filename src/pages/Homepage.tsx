
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsletterModal from '@/components/NewsletterModal';
import CookieConsent from '@/components/CookieConsent';
import AdminControls from '@/components/AdminControls';
import HeroSection from '@/components/home/HeroSection';
import LatestArticles from '@/components/home/LatestArticles';
import CategorySection from '@/components/home/CategorySection';
import NewsletterSection from '@/components/home/NewsletterSection';

const Homepage = () => {
  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-950 dark:text-white">
      <Header />
      
      <main className="flex-grow">
        {/* Admin Controls - only visible in development */}
        {import.meta.env.DEV && <AdminControls />}
        
        <HeroSection />
        <LatestArticles />
        
        <CategorySection 
          title="Startup Spotlight"
          description="Innovative companies making waves in the tech ecosystem"
          category="startups"
          route="/startups"
        />
        
        <CategorySection 
          title="AI Innovation"
          description="Latest breakthroughs in artificial intelligence and machine learning"
          category="ai"
          route="/ai"
        />
        
        <CategorySection 
          title="Funding News"
          description="Latest investment rounds and venture capital activity"
          category="funding"
          route="/funding"
        />
        
        <NewsletterSection />
      </main>
      
      <Footer />
      <NewsletterModal delayInSeconds={15} />
      <CookieConsent />
    </div>
  );
};

export default Homepage;
