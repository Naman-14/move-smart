
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-brand-dark dark:text-white border-b border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <span className="logo text-2xl font-bold text-parrot-green">MoveSmart</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="nav-link hover:text-parrot-green transition-colors">Home</Link>
          <Link to="/startups" className="nav-link hover:text-parrot-green transition-colors">Explore Startups</Link>
          <Link to="/case-studies" className="nav-link hover:text-parrot-green transition-colors">Case Studies</Link>
          <Link to="/about" className="nav-link hover:text-parrot-green transition-colors">About</Link>
          
          <div className="ml-4 flex items-center space-x-3">
            <ThemeToggle />
            <button aria-label="Search" className="text-gray-500 hover:text-parrot-green dark:text-gray-300 dark:hover:text-parrot-green">
              <Search size={20} />
            </button>
            <Button className="btn-primary bg-parrot-green hover:bg-parrot-green/90 text-white">Subscribe</Button>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-3">
          <ThemeToggle />
          <button 
            className="text-gray-500 hover:text-parrot-green dark:text-gray-300 dark:hover:text-parrot-green" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-brand-dark p-4 pt-0 border-b border-gray-100 dark:border-gray-800 shadow-md animate-fade-in-up">
          <nav className="flex flex-col space-y-4">
            <Link to="/" className="nav-link py-2 hover:text-parrot-green transition-colors" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/startups" className="nav-link py-2 hover:text-parrot-green transition-colors" onClick={() => setIsMenuOpen(false)}>Explore Startups</Link>
            <Link to="/case-studies" className="nav-link py-2 hover:text-parrot-green transition-colors" onClick={() => setIsMenuOpen(false)}>Case Studies</Link>
            <Link to="/about" className="nav-link py-2 hover:text-parrot-green transition-colors" onClick={() => setIsMenuOpen(false)}>About</Link>
            
            <div className="flex items-center justify-between pt-2">
              <button 
                aria-label="Search" 
                className="text-gray-500 hover:text-parrot-green dark:text-gray-300 dark:hover:text-parrot-green p-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Search size={20} />
              </button>
              <Button className="btn-primary bg-parrot-green hover:bg-parrot-green/90 text-white" onClick={() => setIsMenuOpen(false)}>Subscribe</Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
