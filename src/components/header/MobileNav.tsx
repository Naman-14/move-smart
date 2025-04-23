
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNav = ({ isOpen, onClose }: MobileNavProps) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-white dark:bg-gray-900 p-4 pt-0 border-b border-gray-100 dark:border-gray-800 shadow-md animate-fade-in-up">
      <nav className="flex flex-col space-y-4">
        <Link to="/" className="nav-link py-2 hover:text-parrot-green transition-colors" onClick={onClose}>Home</Link>
        
        <div className="border-t border-gray-100 dark:border-gray-800 pt-2">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Startups</p>
          <div className="pl-2 space-y-2">
            <Link to="/startups" className="block py-1.5 text-gray-800 dark:text-gray-200 hover:text-parrot-green" onClick={onClose}>Explore Startups</Link>
            <Link to="/startups/featured" className="block py-1.5 text-gray-800 dark:text-gray-200 hover:text-parrot-green" onClick={onClose}>Featured Startups</Link>
            <Link to="/startups/unicorns" className="block py-1.5 text-gray-800 dark:text-gray-200 hover:text-parrot-green" onClick={onClose}>Unicorns</Link>
            <Link to="/startups/early-stage" className="block py-1.5 text-gray-800 dark:text-gray-200 hover:text-parrot-green" onClick={onClose}>Early-Stage</Link>
          </div>
        </div>
        
        <div className="border-t border-gray-100 dark:border-gray-800 pt-2">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Case Studies</p>
          <div className="pl-2 space-y-2">
            <Link to="/case-studies" className="block py-1.5 text-gray-800 dark:text-gray-200 hover:text-parrot-green" onClick={onClose}>All Case Studies</Link>
            <Link to="/case-studies/growth" className="block py-1.5 text-gray-800 dark:text-gray-200 hover:text-parrot-green" onClick={onClose}>Growth Strategies</Link>
            <Link to="/case-studies/product" className="block py-1.5 text-gray-800 dark:text-gray-200 hover:text-parrot-green" onClick={onClose}>Product Development</Link>
          </div>
        </div>
        
        <Link to="/funding" className="nav-link py-2 hover:text-parrot-green transition-colors border-t border-gray-100 dark:border-gray-800" onClick={onClose}>Funding</Link>
        <Link to="/ai" className="nav-link py-2 hover:text-parrot-green transition-colors" onClick={onClose}>AI</Link>
        
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
          <Button className="w-full bg-parrot-green hover:bg-parrot-green/90 text-white" onClick={onClose}>Subscribe</Button>
        </div>
      </nav>
    </div>
  );
};

export default MobileNav;
