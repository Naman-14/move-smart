
import { useState, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useClickAway } from '@/hooks/use-mobile'; // Assuming this hook exists

interface AISearchProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

const AISearch = ({ 
  placeholder = "Search for startups, articles, insights...",
  onSearch
}: AISearchProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Close search panel when clicking outside
  useClickAway(searchContainerRef, () => {
    if (isExpanded) setIsExpanded(false);
  });
  
  const handleExpand = () => {
    setIsExpanded(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };
  
  const handleClose = () => {
    setIsExpanded(false);
    setQuery('');
    setResults([]);
  };
  
  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    
    try {
      // This would be a real API call in production
      await new Promise(r => setTimeout(r, 800));
      
      // Mock results for now
      setResults([
        {
          type: 'article',
          title: 'AI Transformation in Finance: Beyond the Hype',
          excerpt: 'How AI is changing financial services beyond chatbots and automation',
          url: '/article/ai-finance-transformation',
          date: '2 days ago'
        },
        {
          type: 'startup',
          title: 'Anthropic',
          description: 'Building reliable, interpretable, and steerable AI systems',
          url: '/startup/anthropic',
          category: 'AI'
        },
        {
          type: 'article',
          title: 'The Future of Work: How Tech Companies Are Adapting',
          excerpt: 'An in-depth analysis of how the tech industry is reimagining workplace culture',
          url: '/article/future-remote-work',
          date: '5 days ago'
        }
      ]);
      
      if (onSearch) onSearch(query);
      
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search error",
        description: "Could not complete your search. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      handleClose();
    }
  };
  
  return (
    <div ref={searchContainerRef} className="relative">
      {/* Search Trigger Button - When Not Expanded */}
      {!isExpanded ? (
        <button 
          onClick={handleExpand}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Search"
        >
          <Search className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        </button>
      ) : (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center pt-16 px-4 md:px-0">
          <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 animate-fade-in">
            {/* Search Header */}
            <div className="flex items-center gap-3 mb-4">
              <Search className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <Input
                ref={inputRef}
                type="search"
                placeholder={placeholder}
                className="flex-grow border-none text-lg shadow-none focus-visible:ring-0"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isSearching}
              />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleClose}
                className="rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Search Results */}
            <div className="mt-2">
              {isSearching ? (
                <div className="py-8 text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                  </div>
                  <p className="mt-2 text-gray-500">Searching across articles, startups, and insights...</p>
                </div>
              ) : results.length > 0 ? (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {results.map((result, index) => (
                    <div key={index} className="py-3">
                      <a href={result.url} className="block hover:bg-gray-50 dark:hover:bg-gray-800/50 p-2 rounded-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="inline-block px-2 py-1 text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400 rounded mb-1">
                              {result.type === 'article' ? 'Article' : 'Startup'}
                            </div>
                            <h4 className="font-medium text-gray-900 dark:text-gray-100">{result.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {result.type === 'article' ? result.excerpt : result.description}
                            </p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0 mt-2" />
                        </div>
                        {result.date && (
                          <p className="text-xs text-gray-500 mt-1">{result.date}</p>
                        )}
                        {result.category && (
                          <div className="text-xs text-gray-500 mt-1">Category: {result.category}</div>
                        )}
                      </a>
                    </div>
                  ))}
                  
                  <div className="py-4 text-center">
                    <Button asChild variant="outline" size="sm">
                      <a href={`/search?q=${encodeURIComponent(query)}`}>
                        See all results
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              ) : query && !isSearching ? (
                <div className="py-8 text-center">
                  <p className="text-gray-500">No results found for "{query}"</p>
                  <p className="text-sm text-gray-400 mt-1">Try different keywords or browse our categories</p>
                </div>
              ) : (
                <div className="py-4 text-center text-sm text-gray-500">
                  <p>Type to search for articles, startups, and insights</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AISearch;
