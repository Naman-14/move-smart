
import PageTemplate from '@/components/PageTemplate';
import ArticleCard from '@/components/ArticleCard';
import ContentFilter from '@/components/ContentFilter';
import { useState } from 'react';

const AI = () => {
  const [filter, setFilter] = useState('all');

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
    }
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
          categories={['All', 'Research', 'Applications', 'Safety', 'Ethics']}
          activeCategory={filter}
          onCategoryChange={setFilter}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {articles.map(article => (
            <ArticleCard key={article.id} {...article} />
          ))}
        </div>
      </div>
    </PageTemplate>
  );
};

export default AI;
