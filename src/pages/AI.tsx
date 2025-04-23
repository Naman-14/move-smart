
import PageTemplate from '@/components/PageTemplate';
import ArticleCard from '@/components/ArticleCard';
import ContentFilter, { ContentFilters } from '@/components/ContentFilter';
import { useState } from 'react';

const AI = () => {
  const [filter, setFilter] = useState('all');
  const [filters, setFilters] = useState<ContentFilters>({
    search: '',
    categories: [],
    regions: [],
    fundingStages: [],
    tags: []
  });

  const articles = [
    {
      id: '1',
      title: 'The Rise of Multi-Modal AI Models',
      excerpt: 'How new AI models are combining different types of data for better understanding.',
      imageUrl: 'https://images.unsplash.com/photo-1677442135132-141996581d28',
      date: 'April 21, 2025',
      category: 'Research',
      slug: 'rise-of-multimodal-ai'
    },
    {
      id: '2',
      title: 'AI Safety: The Path Forward',
      excerpt: 'Leading researchers discuss the importance of AI alignment and safety measures.',
      imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485',
      date: 'April 20, 2025',
      category: 'Safety',
      slug: 'ai-safety-path-forward'
    },
    {
      id: '3',
      title: 'Generative AI for Enterprise Applications',
      excerpt: 'How businesses are leveraging generative AI to transform workflows and drive innovation.',
      imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485',
      date: 'April 18, 2025',
      category: 'Applications',
      slug: 'generative-ai-enterprise'
    },
    {
      id: '4',
      title: 'The Ethics of AI Development',
      excerpt: 'Examining the moral implications and responsibilities of creating advanced AI systems.',
      imageUrl: 'https://images.unsplash.com/photo-1677442135132-141996581d28',
      date: 'April 15, 2025',
      category: 'Ethics',
      slug: 'ethics-ai-development'
    }
  ];

  // Filter options properly formatted as FilterOption objects
  const filterCategories = [
    { id: 'research', label: 'Research' },
    { id: 'applications', label: 'Applications' },
    { id: 'safety', label: 'Safety' },
    { id: 'ethics', label: 'Ethics' },
    { id: 'policy', label: 'Policy' }
  ];

  const filterRegions = [
    { id: 'north-america', label: 'North America' },
    { id: 'europe', label: 'Europe' },
    { id: 'asia-pacific', label: 'Asia Pacific' },
    { id: 'global', label: 'Global' }
  ];

  const filterTags = [
    { id: 'llm', label: 'Large Language Models' },
    { id: 'computer-vision', label: 'Computer Vision' },
    { id: 'generative', label: 'Generative AI' },
    { id: 'nlp', label: 'Natural Language Processing' },
    { id: 'ml-ops', label: 'ML Ops' }
  ];

  return (
    <PageTemplate>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">AI Innovation Hub</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Stay updated with the latest breakthroughs and developments in artificial intelligence.
          </p>
        </div>

        <ContentFilter
          categories={filterCategories}
          regions={filterRegions}
          fundingStages={[
            { id: 'research', label: 'Research Phase' },
            { id: 'prototype', label: 'Prototype' },
            { id: 'production', label: 'Production Ready' },
            { id: 'deployed', label: 'Widely Deployed' }
          ]}
          tags={filterTags}
          onFilterChange={setFilters}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-8">
          {articles.map(article => (
            <ArticleCard key={article.id} {...article} />
          ))}
        </div>
      </div>
    </PageTemplate>
  );
};

export default AI;
