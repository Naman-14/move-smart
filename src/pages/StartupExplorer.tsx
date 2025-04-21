
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StartupCard from '@/components/StartupCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import NewsletterForm from '@/components/NewsletterForm';

// Mock startup data - In a real app, this would come from an API/database
const mockStartups = [
  {
    name: 'Anthropic',
    description: 'AI safety company focused on building reliable, interpretable, and steerable AI systems.',
    logoUrl: 'https://images.unsplash.com/photo-1677442135132-141996581d28?q=80&w=2070&auto=format&fit=crop',
    founded: '2021',
    category: 'Artificial Intelligence',
    businessModel: 'B2B',
    fundingStage: 'Series C',
    fundingAmount: '$1.5B',
    location: 'San Francisco, CA',
    slug: 'anthropic'
  },
  {
    name: 'Vercel',
    description: 'Frontend cloud platform that enables developers to build and deploy web applications with unprecedented speed and scale.',
    logoUrl: '',
    founded: '2015',
    category: 'Developer Tools',
    businessModel: 'SaaS',
    fundingStage: 'Series D',
    fundingAmount: '$150M',
    location: 'San Francisco, CA',
    slug: 'vercel'
  },
  {
    name: 'Notion',
    description: 'All-in-one workspace for notes, tasks, wikis, and databases that helps teams collaborate and stay organized.',
    logoUrl: '',
    founded: '2013',
    category: 'Productivity',
    businessModel: 'Freemium SaaS',
    fundingStage: 'Series C',
    fundingAmount: '$275M',
    location: 'San Francisco, CA',
    slug: 'notion'
  },
  {
    name: 'Stripe',
    description: 'Financial infrastructure platform for businesses to accept payments, send payouts, and manage their businesses online.',
    logoUrl: '',
    founded: '2010',
    category: 'FinTech',
    businessModel: 'Transaction Fee',
    fundingStage: 'Late Stage',
    fundingAmount: '$2.2B',
    location: 'San Francisco, CA',
    slug: 'stripe'
  },
  {
    name: 'Figma',
    description: 'Design platform for teams who build products together, enabling real-time collaboration in the browser.',
    logoUrl: '',
    founded: '2012',
    category: 'Design Tools',
    businessModel: 'SaaS',
    fundingStage: 'Acquired',
    fundingAmount: '$20B Exit',
    location: 'San Francisco, CA',
    slug: 'figma'
  },
  {
    name: 'Rippling',
    description: 'Employee management platform that unifies payroll, benefits, HR, IT, and more to manage all employee operations.',
    logoUrl: '',
    founded: '2016',
    category: 'HR Tech',
    businessModel: 'SaaS',
    fundingStage: 'Series D',
    fundingAmount: '$500M',
    location: 'San Francisco, CA',
    slug: 'rippling'
  }
];

const categories = [
  'All',
  'Artificial Intelligence',
  'FinTech',
  'SaaS',
  'Developer Tools',
  'Productivity',
  'HR Tech',
  'Health Tech',
  'EdTech',
  'CleanTech',
  'AgTech',
  'Blockchain'
];

const fundingStages = [
  'All Stages',
  'Pre-Seed',
  'Seed',
  'Series A',
  'Series B',
  'Series C',
  'Series D+',
  'Late Stage',
  'IPO',
  'Acquired'
];

const businessModels = [
  'All Models',
  'SaaS',
  'Marketplace',
  'E-commerce',
  'Subscription',
  'Freemium',
  'Transaction Fee',
  'B2B',
  'B2C',
  'B2B2C',
  'Enterprise'
];

const regions = [
  'Global',
  'North America',
  'Europe',
  'Asia-Pacific',
  'Latin America',
  'Africa',
  'Middle East'
];

interface FilterState {
  search: string;
  category: string;
  fundingStage: string;
  businessModel: string;
  region: string;
  fundingRange: [number, number];
  foundedAfter: number;
}

const StartupExplorer = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [startups, setStartups] = useState(mockStartups);
  
  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'All',
    fundingStage: searchParams.get('stage') || 'All Stages',
    businessModel: 'All Models',
    region: 'Global',
    fundingRange: [0, 2500],
    foundedAfter: 2005
  });
  
  useEffect(() => {
    // In a real app, this would be an API call with the filters
    let filtered = [...mockStartups];
    
    // Apply filters
    if (filters.search) {
      filtered = filtered.filter(startup => 
        startup.name.toLowerCase().includes(filters.search.toLowerCase()) || 
        startup.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    if (filters.category !== 'All') {
      filtered = filtered.filter(startup => 
        startup.category === filters.category
      );
    }
    
    if (filters.fundingStage !== 'All Stages') {
      filtered = filtered.filter(startup => 
        startup.fundingStage === filters.fundingStage
      );
    }
    
    if (filters.businessModel !== 'All Models') {
      filtered = filtered.filter(startup => 
        startup.businessModel === filters.businessModel
      );
    }
    
    // Update URL with search params
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.category !== 'All') params.set('category', filters.category);
    if (filters.fundingStage !== 'All Stages') params.set('stage', filters.fundingStage);
    setSearchParams(params);
    
    // Update active filters for display
    const newActiveFilters = [];
    if (filters.category !== 'All') newActiveFilters.push(filters.category);
    if (filters.fundingStage !== 'All Stages') newActiveFilters.push(filters.fundingStage);
    if (filters.businessModel !== 'All Models') newActiveFilters.push(filters.businessModel);
    if (filters.region !== 'Global') newActiveFilters.push(filters.region);
    setActiveFilters(newActiveFilters);
    
    setStartups(filtered);
  }, [filters, setSearchParams]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };
  
  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: 'All',
      fundingStage: 'All Stages',
      businessModel: 'All Models',
      region: 'Global',
      fundingRange: [0, 2500],
      foundedAfter: 2005
    });
    setSearchParams({});
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Explore the World's Most Innovative Startups
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Discover in-depth profiles, funding details, business models, and lessons learned from the most disruptive tech companies.
              </p>
              
              {/* Search & Filter Bar */}
              <div className="flex flex-col md:flex-row gap-3 max-w-2xl mx-auto">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="search"
                    placeholder="Search startups, industries, or technologies..."
                    className="pl-10 w-full"
                    value={filters.search}
                    onChange={handleSearchChange}
                  />
                </div>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={toggleFilters}
                >
                  <Filter size={16} />
                  <span>Filters</span>
                  {activeFilters.length > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {activeFilters.length}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Expanded Filters */}
        {showFilters && (
          <section className="bg-gray-50 dark:bg-gray-900 py-6 border-y border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select 
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2"
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                {/* Funding Stage Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Funding Stage</label>
                  <select 
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2"
                    value={filters.fundingStage}
                    onChange={(e) => setFilters(prev => ({ ...prev, fundingStage: e.target.value }))}
                  >
                    {fundingStages.map((stage) => (
                      <option key={stage} value={stage}>{stage}</option>
                    ))}
                  </select>
                </div>
                
                {/* Business Model Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Business Model</label>
                  <select 
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2"
                    value={filters.businessModel}
                    onChange={(e) => setFilters(prev => ({ ...prev, businessModel: e.target.value }))}
                  >
                    {businessModels.map((model) => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                </div>
                
                {/* Region Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Region</label>
                  <select 
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2"
                    value={filters.region}
                    onChange={(e) => setFilters(prev => ({ ...prev, region: e.target.value }))}
                  >
                    {regions.map((region) => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>
                
                {/* Funding Amount Range */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Funding Amount (in millions)
                    <span className="text-gray-500 ml-2">
                      ${filters.fundingRange[0]}M - ${filters.fundingRange[1] === 2500 ? '2.5B+' : `${filters.fundingRange[1]}M`}
                    </span>
                  </label>
                  <Slider 
                    value={filters.fundingRange as any}
                    min={0}
                    max={2500}
                    step={50}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, fundingRange: value as [number, number] }))}
                    className="py-4"
                  />
                </div>
                
                {/* Founded After */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Founded After
                    <span className="text-gray-500 ml-2">{filters.foundedAfter}</span>
                  </label>
                  <Slider 
                    value={[filters.foundedAfter]}
                    min={2000}
                    max={2025}
                    step={1}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, foundedAfter: value[0] }))}
                    className="py-4"
                  />
                </div>
              </div>
              
              {/* Filter Actions */}
              <div className="flex justify-end mt-4 gap-2">
                <Button variant="outline" onClick={handleClearFilters}>Clear All</Button>
                <Button onClick={() => setShowFilters(false)}>Apply Filters</Button>
              </div>
            </div>
          </section>
        )}
        
        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <section className="container mx-auto px-4 py-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500">Active Filters:</span>
              {activeFilters.map((filter) => (
                <Badge key={filter} variant="secondary" className="px-3 py-1 text-sm">
                  {filter}
                  <button 
                    className="ml-2 text-xs opacity-70 hover:opacity-100"
                    onClick={() => {
                      // Remove this filter
                      if (filters.category === filter) {
                        setFilters(prev => ({ ...prev, category: 'All' }));
                      } else if (filters.fundingStage === filter) {
                        setFilters(prev => ({ ...prev, fundingStage: 'All Stages' }));
                      } else if (filters.businessModel === filter) {
                        setFilters(prev => ({ ...prev, businessModel: 'All Models' }));
                      } else if (filters.region === filter) {
                        setFilters(prev => ({ ...prev, region: 'Global' }));
                      }
                    }}
                  >
                    ×
                  </button>
                </Badge>
              ))}
              <Button variant="ghost" size="sm" onClick={handleClearFilters}>Clear All</Button>
            </div>
          </section>
        )}
        
        {/* Tabs for different views */}
        <section className="container mx-auto px-4 py-8">
          <Tabs defaultValue="all" className="mb-8">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Startups</TabsTrigger>
              <TabsTrigger value="unicorns">Unicorns</TabsTrigger>
              <TabsTrigger value="emerging">Emerging</TabsTrigger>
              <TabsTrigger value="acquired">Acquired</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="p-0">
              {startups.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {startups.map((startup) => (
                    <StartupCard key={startup.name} {...startup} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-bold mb-2">No startups match your filters</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your search criteria or clear all filters.</p>
                  <Button variant="outline" onClick={handleClearFilters}>Clear All Filters</Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="unicorns" className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockStartups
                  .filter(s => s.name === 'Stripe' || s.name === 'Figma' || s.name === 'Anthropic')
                  .map((startup) => (
                    <StartupCard key={startup.name} {...startup} />
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="emerging" className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockStartups
                  .filter(s => s.name === 'Vercel' || s.name === 'Rippling')
                  .map((startup) => (
                    <StartupCard key={startup.name} {...startup} />
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="acquired" className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockStartups
                  .filter(s => s.fundingStage === 'Acquired')
                  .map((startup) => (
                    <StartupCard key={startup.name} {...startup} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="text-center mt-12">
            <Button variant="outline">Load More Startups</Button>
          </div>
        </section>
        
        {/* Newsletter Section */}
        <section className="bg-brand-dark text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Get Exclusive Startup Intelligence</h2>
              <p className="text-gray-300 mb-8">
                Join our weekly newsletter for the latest startup profiles, funding rounds, and market insights.
              </p>
              <div className="max-w-md mx-auto">
                <NewsletterForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default StartupExplorer;
