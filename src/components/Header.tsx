
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import DesktopNavItems from './header/DesktopNavItems';
import MobileNav from './header/MobileNav';
import HeaderActions from './header/HeaderActions';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-50 transition-all duration-300 w-full",
      isScrolled 
        ? "bg-white dark:bg-gray-900 shadow-sm border-b border-gray-100 dark:border-gray-800" 
        : "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md"
    )}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center">
              <span className="logo text-2xl font-bold text-parrot-green">MoveSmart</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-1">
              <DesktopNavItems />
            </nav>
          </div>

          <HeaderActions isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        </div>
      </div>

      <MobileNav isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
};

export default Header;
