
import PageTemplate from '@/components/PageTemplate';
import { Button } from '@/components/ui/button';
import StartupCard from '@/components/StartupCard';
import ContentFilter from '@/components/ContentFilter';
import { useState } from 'react';

const Startups = () => {
  const [filter, setFilter] = useState('all');

  // This would typically come from your backend
  const mockStartups = [
    {
      id: '1',
      name: 'TechVision AI',
      description: 'Revolutionizing computer vision with advanced AI algorithms',
      image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485',
      category: 'AI',
      fundingStage: 'Series A',
      location: 'San Francisco, CA'
    },
    {
      id: '2',
      name: 'GreenEnergy Solutions',
      description: 'Sustainable energy solutions for the modern world',
      image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69',
      category: 'CleanTech',
      fundingStage: 'Series B',
      location: 'Austin, TX'
    },
    // Add more mock startups here
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
          categories={['All', 'AI', 'CleanTech', 'FinTech', 'HealthTech']}
          activeCategory={filter}
          onCategoryChange={setFilter}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {mockStartups.map(startup => (
            <StartupCard
              key={startup.id}
              {...startup}
            />
          ))}
        </div>
      </div>
    </PageTemplate>
  );
};

export default Startups;
