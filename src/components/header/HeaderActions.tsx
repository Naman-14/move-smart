
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';
import AISearch from '../AISearch';

interface HeaderActionsProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

const HeaderActions = ({ isMenuOpen, setIsMenuOpen }: HeaderActionsProps) => {
  return (
    <div className="flex items-center space-x-3">
      <div className="hidden md:block relative">
        <AISearch />
      </div>
      
      <ThemeToggle />
      
      <Link to="/startups" className="hidden md:flex mr-2">
        <Button variant="outline" className="border-parrot-green text-parrot-green hover:bg-parrot-green/10">
          Explore Startups
        </Button>
      </Link>
      
      <Button className="hidden md:flex bg-parrot-green hover:bg-parrot-green/90 text-white">
        Subscribe
      </Button>
      
      <button 
        className="md:hidden text-gray-500 hover:text-parrot-green dark:text-gray-300 dark:hover:text-parrot-green" 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </div>
  );
};

export default HeaderActions;
