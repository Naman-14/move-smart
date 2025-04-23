
import HeroCarousel from '@/components/HeroCarousel';
import { useArticles } from '@/hooks/useArticles';
import { format } from 'date-fns';

const HeroSection = () => {
  const { articles, isLoading } = useArticles({ limit: 5 });

  // Format hero slides from articles
  const heroSlides = articles.slice(0, 5).map(article => ({
    id: article.id,
    title: article.title,
    excerpt: article.summary,
    imageUrl: article.cover_image_url,
    category: article.category,
    author: 'MoveSmart',
    publishedAt: format(new Date(article.created_at), 'MMMM dd, yyyy'),
    slug: article.slug
  }));

  return (
    <section className="container mx-auto px-4 py-6">
      {isLoading ? (
        <div className="h-[500px] md:h-[600px] bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
      ) : (
        <HeroCarousel slides={heroSlides} />
      )}
    </section>
  );
};

export default HeroSection;
