
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAcceptedCookies = localStorage.getItem('cookie_consent');
    
    if (!hasAcceptedCookies) {
      setIsVisible(true);
    }
  }, []);
  
  const handleAcceptAll = () => {
    localStorage.setItem('cookie_consent', 'all');
    setIsVisible(false);
  };
  
  const handleAcceptEssential = () => {
    localStorage.setItem('cookie_consent', 'essential');
    setIsVisible(false);
  };
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 p-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-medium mb-2">We value your privacy</h3>
            <p className="text-sm text-gray-600 mb-2">
              We use cookies to enhance your browsing experience, serve personalized content, 
              and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
            </p>
            <div className="text-sm">
              <Link to="/privacy" className="text-parrot-blue hover:underline">
                Privacy Policy
              </Link>
              {' | '}
              <Link to="/cookies" className="text-parrot-blue hover:underline">
                Cookie Policy
              </Link>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline"
              onClick={handleAcceptEssential}
              className="whitespace-nowrap"
            >
              Essential Only
            </Button>
            <Button 
              onClick={handleAcceptAll}
              className="btn-primary whitespace-nowrap"
            >
              Accept All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
