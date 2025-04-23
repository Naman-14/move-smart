
import { useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import ArticleCard from '@/components/ArticleCard';
import ContentFilter, { ContentFilters } from '@/components/ContentFilter';
import { Button } from '@/components/ui/button';

// Mock data for case studies
const caseStudies = [
  {
    id: '1',
    title: 'How Notion Disrupted the Productivity Software Market',
    excerpt: 'A deep dive into Notion\'s meteoric rise, innovative product strategy, and how it captured a devoted user base in a crowded market.',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2940&fit=crop&auto=format',
    date: 'April 15, 2025',
    category: 'Growth Strategy',
    slug: 'notion-disruption'
  },
  {
    id: '2',
    title: 'The Tech Behind Stripe\'s Success Story',
    excerpt: 'How Stripe revolutionized online payments and became the backbone of internet commerce.',
    imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2940&auto=format&fit=crop',
    date: 'April 14, 2025',
    category: 'Product Development',
    slug: 'stripe-success-story'
  },
  {
    id: '3',
    title: 'Figma\'s Path to a $20B Valuation',
    excerpt: 'The design tool that changed collaboration and caught Adobe\'s attention with a revolutionary product approach.',
    imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=2940&auto=format&fit=crop',
    date: 'April 8, 2025',
    category: 'Funding Strategy',
    slug: 'figma-valuation'
  },
  {
    id: '4',
    title: 'How Discord Built a Community-First Platform',
    excerpt: 'The evolution of Discord from gaming chat to a versatile community platform worth billions.',
    imageUrl: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?q=80&w=2940&auto=format&fit=crop',
    date: 'April 2, 2025',
    category: 'Community Building',
    slug: 'discord-community'
  },
  {
    id: '5',
    title: 'Canva: Democratizing Design for Everyone',
    excerpt: 'How an Australian startup built a design platform that anyone can use and scaled to a multi-billion dollar valuation.',
    imageUrl: 'https://images.unsplash.com/photo-1633409361618-c73427e4e206?q=80&w=2080&auto=format&fit=crop',
    date: 'March 28, 2025',
    category: 'Growth Strategy',
    slug: 'canva-democratizing-design'
  },
  {
    id: '6',
    title: 'Airtable: From Spreadsheet to Platform',
    excerpt: 'How Airtable transformed from a simple spreadsheet alternative to a powerful no-code platform that powers thousands of businesses.',
    imageUrl: 'https://images.unsplash.com/photo-1618044733300-9472054094ee?q=80&w=2071&auto=format&fit=crop',
    date: 'March 25, 2025',
    category: 'Product Development',
    slug: 'airtable-platform-evolution'
  }
];

// Filter options
const filterCategories = [
  { id: 'growth-strategy', label: 'Growth Strategy' },
  { id: 'product-development', label: 'Product Development' },
  { id: 'funding-strategy', label: 'Funding Strategy' },
  { id: 'community-building', label: 'Community Building' }
];

const filterRegions = [
  { id: 'north-america', label: 'North America' },
  { id: 'europe', label: 'Europe' },
  { id: 'asia-pacific', label: 'Asia Pacific' },
  { id: 'latin-america', label: 'Latin America' }
];

const filterCompanyStages = [
  { id: 'early-stage', label: 'Early Stage' },
  { id: 'growth-stage', label: 'Growth Stage' },
  { id: 'late-stage', label: 'Late Stage' },
  { id: 'public', label: 'Public Companies' }
];

const filterTags = [
  { id: 'ai', label: 'AI' },
  { id: 'saas', label: 'SaaS' },
  { id: 'marketplace', label: 'Marketplace' },
  { id: 'b2b', label: 'B2B' },
  { id: 'b2c', label: 'B2C' }
];

const CaseStudies = () => {
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
          <h1 className="text-4xl font-bold mb-4">Case Studies</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            In-depth analyses of successful companies and their strategies for growth, product development, and market disruption.
          </p>
        </div>

        <ContentFilter
          categories={filterCategories}
          regions={filterRegions}
          fundingStages={filterCompanyStages}
          tags={filterTags}
          onFilterChange={setFilters}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {caseStudies.map(study => (
            <ArticleCard
              key={study.id}
              title={study.title}
              excerpt={study.excerpt}
              imageUrl={study.imageUrl}
              date={study.date}
              category={study.category}
              slug={study.slug}
            />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Button variant="outline" className="border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800">
            Load More Case Studies
          </Button>
        </div>
      </div>
    </PageTemplate>
  );
};

export default CaseStudies;
