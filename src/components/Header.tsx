
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <span className="logo">MoveSmart</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/archive" className="nav-link">Archive</Link>
          <Link to="/case-studies" className="nav-link">Case Studies</Link>
          <Link to="/about" className="nav-link">About</Link>
          
          <div className="ml-4 flex items-center space-x-3">
            <button aria-label="Search" className="text-gray-500 hover:text-parrot-green">
              <Search size={20} />
            </button>
            <Button className="btn-primary">Subscribe</Button>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-500 hover:text-parrot-green" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white p-4 pt-0 border-b border-gray-100 shadow-md animate-fade-in-up">
          <nav className="flex flex-col space-y-4">
            <Link to="/" className="nav-link py-2" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/archive" className="nav-link py-2" onClick={() => setIsMenuOpen(false)}>Archive</Link>
            <Link to="/case-studies" className="nav-link py-2" onClick={() => setIsMenuOpen(false)}>Case Studies</Link>
            <Link to="/about" className="nav-link py-2" onClick={() => setIsMenuOpen(false)}>About</Link>
            
            <div className="flex items-center justify-between pt-2">
              <button 
                aria-label="Search" 
                className="text-gray-500 hover:text-parrot-green p-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Search size={20} />
              </button>
              <Button className="btn-primary" onClick={() => setIsMenuOpen(false)}>Subscribe</Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
