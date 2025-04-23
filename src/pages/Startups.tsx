
import PageTemplate from '@/components/PageTemplate';
import { Button } from '@/components/ui/button';
import StartupCard from '@/components/StartupCard';
import ContentFilter, { ContentFilters } from '@/components/ContentFilter';
import { useState } from 'react';

const Startups = () => {
  const [filter, setFilter] = useState('all');
  const [filters, setFilters] = useState<ContentFilters>({
    search: '',
    categories: [],
    regions: [],
    fundingStages: [],
    tags: []
  });

  // This would typically come from your backend
  const mockStartups = [
    {
      name: 'TechVision AI',
      description: 'Revolutionizing computer vision with advanced AI algorithms',
      logoUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485',
      founded: '2020',
      category: 'AI',
      businessModel: 'SaaS',
      fundingStage: 'Series A',
      fundingAmount: '$15M',
      location: 'San Francisco, CA',
      slug: 'techvision-ai'
    },
    {
      name: 'GreenEnergy Solutions',
      description: 'Sustainable energy solutions for the modern world',
      logoUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69',
      founded: '2018',
      category: 'CleanTech',
      businessModel: 'B2B',
      fundingStage: 'Series B',
      fundingAmount: '$45M',
      location: 'Austin, TX',
      slug: 'greenenergy-solutions'
    },
    {
      name: 'FinanceFlow',
      description: 'Streamlining financial operations for small businesses',
      logoUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236e3',
      founded: '2021',
      category: 'FinTech',
      businessModel: 'SaaS',
      fundingStage: 'Seed',
      fundingAmount: '$3.5M',
      location: 'New York, NY',
      slug: 'financeflow'
    }
  ];

  // Filter options properly formatted as FilterOption objects
  const filterCategories = [
    { id: 'all', label: 'All' },
    { id: 'ai', label: 'AI' },
    { id: 'cleantech', label: 'CleanTech' },
    { id: 'fintech', label: 'FinTech' },
    { id: 'healthtech', label: 'HealthTech' }
  ];

  const filterRegions = [
    { id: 'north-america', label: 'North America' },
    { id: 'europe', label: 'Europe' },
    { id: 'asia-pacific', label: 'Asia Pacific' },
    { id: 'latin-america', label: 'Latin America' }
  ];

  const filterFundingStages = [
    { id: 'seed', label: 'Seed' },
    { id: 'series-a', label: 'Series A' },
    { id: 'series-b', label: 'Series B' },
    { id: 'series-c', label: 'Series C' },
    { id: 'late-stage', label: 'Late Stage' }
  ];
  
  const filterTags = [
    { id: 'ai', label: 'AI' },
    { id: 'saas', label: 'SaaS' },
    { id: 'b2b', label: 'B2B' },
    { id: 'b2c', label: 'B2C' },
    { id: 'marketplace', label: 'Marketplace' }
  ];

  return (
    <PageTemplate>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Innovative Startups</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Discover groundbreaking companies reshaping industries and creating the future.
          </p>
        </div>

        <ContentFilter
          categories={filterCategories}
          regions={filterRegions}
          fundingStages={filterFundingStages}
          tags={filterTags}
          onFilterChange={setFilters}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {mockStartups.map(startup => (
            <StartupCard
              key={startup.name}
              {...startup}
            />
          ))}
        </div>
      </div>
    </PageTemplate>
  );
};

export default Startups;
