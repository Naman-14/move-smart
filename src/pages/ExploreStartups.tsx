
import { useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import StartupCard from '@/components/StartupCard';
import ContentFilter, { ContentFilters } from '@/components/ContentFilter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Mock data for startups
const mockStartups = [
  {
    name: 'Vercel',
    description: 'Frontend cloud platform that enables developers to build and deploy web applications with unprecedented speed and scale.',
    logoUrl: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=1170&auto=format&fit=crop',
    founded: '2015',
    category: 'Developer Tools',
    businessModel: 'SaaS',
    fundingStage: 'Series C',
    fundingAmount: '$150M',
    location: 'San Francisco, CA',
    slug: 'vercel'
  },
  {
    name: 'Anthropic',
    description: 'AI safety company working on building reliable, interpretable, and steerable AI systems.',
    logoUrl: 'https://images.unsplash.com/photo-1677442135132-141996581d28?q=80&w=1932&auto=format&fit=crop',
    founded: '2021',
    category: 'Artificial Intelligence',
    businessModel: 'Research & Commercial',
    fundingStage: 'Series B',
    fundingAmount: '$580M',
    location: 'San Francisco, CA',
    slug: 'anthropic'
  },
  {
    name: 'Stripe',
    description: 'Financial infrastructure platform for businesses to accept payments, send payouts, and manage their businesses online.',
    logoUrl: 'https://images.unsplash.com/photo-1613243555988-441166d4d6fd?q=80&w=2070&auto=format&fit=crop',
    founded: '2010',
    category: 'FinTech',
    businessModel: 'Payment Processing',
    fundingStage: 'Late Stage',
    fundingAmount: '$2.2B',
    location: 'San Francisco, CA',
    slug: 'stripe'
  },
  {
    name: 'Notion',
    description: 'All-in-one workspace for notes, tasks, wikis, and databases that helps teams collaborate and stay organized.',
    logoUrl: 'https://images.unsplash.com/photo-1626908013351-800ddd734b8a?q=80&w=2070&auto=format&fit=crop',
    founded: '2016',
    category: 'Productivity',
    businessModel: 'SaaS',
    fundingStage: 'Series C',
    fundingAmount: '$275M',
    location: 'San Francisco, CA',
    slug: 'notion'
  },
  {
    name: 'Canva',
    description: 'Online design and publishing tool with a mission to empower everyone in the world to design anything and publish anywhere.',
    logoUrl: 'https://images.unsplash.com/photo-1633409361618-c73427e4e206?q=80&w=2080&auto=format&fit=crop',
    founded: '2013',
    category: 'Design',
    businessModel: 'Freemium',
    fundingStage: 'Late Stage',
    fundingAmount: '$300M',
    location: 'Sydney, Australia',
    slug: 'canva'
  },
  {
    name: 'Airtable',
    description: 'Cloud collaboration service that combines the features of a database with the interface of a spreadsheet.',
    logoUrl: 'https://images.unsplash.com/photo-1618044733300-9472054094ee?q=80&w=2071&auto=format&fit=crop',
    founded: '2012',
    category: 'Productivity',
    businessModel: 'SaaS',
    fundingStage: 'Series F',
    fundingAmount: '$735M',
    location: 'San Francisco, CA',
    slug: 'airtable'
  }
];

// Filter options
const filterCategories = [
  { id: 'artificial-intelligence', label: 'Artificial Intelligence' },
  { id: 'fintech', label: 'FinTech' },
  { id: 'developer-tools', label: 'Developer Tools' },
  { id: 'productivity', label: 'Productivity' },
  { id: 'design', label: 'Design' }
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
  { id: 'fintech', label: 'FinTech' },
  { id: 'health-tech', label: 'Health Tech' },
  { id: 'clean-tech', label: 'Clean Tech' }
];

const ExploreStartups = () => {
  const [filters, setFilters] = useState<ContentFilters>({
    search: '',
    categories: [],
    regions: [],
    fundingStages: [],
    tags: []
  });

  return (
    <PageTemplate>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Discover Innovative Startups</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Explore our curated database of promising startups across various industries and funding stages.
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
          {mockStartups.map((startup, index) => (
            <StartupCard key={index} {...startup} />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Button variant="outline" className="border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800">
            Load More
          </Button>
        </div>
      </div>
    </PageTemplate>
  );
};

export default ExploreStartups;
