import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import AISearch from './AISearch';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
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
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <Link to="/">
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Home
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Startups</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        <li className="row-span-3">
                          <NavigationMenuLink asChild>
                            <Link
                              to="/startups/featured"
                              className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-parrot-green/50 to-parrot-green p-6 no-underline outline-none focus:shadow-md"
                            >
                              <div className="mb-2 text-lg font-medium text-white">
                                Featured Startups
                              </div>
                              <p className="text-sm leading-tight text-white/90">
                                Discover innovative companies changing the tech landscape
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link to="/startups" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <div className="text-sm font-medium leading-none">All Startups</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Browse our comprehensive database of promising startups
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link to="/startups/unicorns" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <div className="text-sm font-medium leading-none">Unicorns</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Companies valued at over $1 billion
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link to="/startups/early-stage" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <div className="text-sm font-medium leading-none">Early-Stage</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Promising seed and Series A startups to watch
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Case Studies</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px]">
                        <li>
                          <NavigationMenuLink asChild>
                            <Link to="/case-studies" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <div className="text-sm font-medium leading-none">All Case Studies</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                In-depth analyses of successful companies and their strategies
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link to="/case-studies/growth" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <div className="text-sm font-medium leading-none">Growth Strategies</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                How successful startups achieved explosive growth
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link to="/case-studies/product" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <div className="text-sm font-medium leading-none">Product Development</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Product-led strategies and innovation case studies
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <Link to="/funding">
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Funding
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <Link to="/ai">
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        AI
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </nav>
          </div>

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
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 p-4 pt-0 border-b border-gray-100 dark:border-gray-800 shadow-md animate-fade-in-up">
          <nav className="flex flex-col space-y-4">
            <Link to="/" className="nav-link py-2 hover:text-parrot-green transition-colors" onClick={() => setIsMenuOpen(false)}>Home</Link>
            
            <div className="border-t border-gray-100 dark:border-gray-800 pt-2">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Startups</p>
              <div className="pl-2 space-y-2">
                <Link to="/startups" className="block py-1.5 text-gray-800 dark:text-gray-200 hover:text-parrot-green" onClick={() => setIsMenuOpen(false)}>Explore Startups</Link>
                <Link to="/startups/featured" className="block py-1.5 text-gray-800 dark:text-gray-200 hover:text-parrot-green" onClick={() => setIsMenuOpen(false)}>Featured Startups</Link>
                <Link to="/startups/unicorns" className="block py-1.5 text-gray-800 dark:text-gray-200 hover:text-parrot-green" onClick={() => setIsMenuOpen(false)}>Unicorns</Link>
                <Link to="/startups/early-stage" className="block py-1.5 text-gray-800 dark:text-gray-200 hover:text-parrot-green" onClick={() => setIsMenuOpen(false)}>Early-Stage</Link>
              </div>
            </div>
            
            <div className="border-t border-gray-100 dark:border-gray-800 pt-2">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Case Studies</p>
              <div className="pl-2 space-y-2">
                <Link to="/case-studies" className="block py-1.5 text-gray-800 dark:text-gray-200 hover:text-parrot-green" onClick={() => setIsMenuOpen(false)}>All Case Studies</Link>
                <Link to="/case-studies/growth" className="block py-1.5 text-gray-800 dark:text-gray-200 hover:text-parrot-green" onClick={() => setIsMenuOpen(false)}>Growth Strategies</Link>
                <Link to="/case-studies/product" className="block py-1.5 text-gray-800 dark:text-gray-200 hover:text-parrot-green" onClick={() => setIsMenuOpen(false)}>Product Development</Link>
              </div>
            </div>
            
            <Link to="/funding" className="nav-link py-2 hover:text-parrot-green transition-colors border-t border-gray-100 dark:border-gray-800" onClick={() => setIsMenuOpen(false)}>Funding</Link>
            <Link to="/ai" className="nav-link py-2 hover:text-parrot-green transition-colors" onClick={() => setIsMenuOpen(false)}>AI</Link>
            
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
              <Button className="w-full bg-parrot-green hover:bg-parrot-green/90 text-white" onClick={() => setIsMenuOpen(false)}>Subscribe</Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
