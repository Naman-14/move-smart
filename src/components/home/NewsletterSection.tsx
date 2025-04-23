
import NewsletterForm from '@/components/NewsletterForm';

const NewsletterSection = () => {
  return (
    <section className="py-16 bg-brand-dark text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Ahead of the Curve</h2>
          <p className="text-gray-300 mb-8">
            Join thousands of founders, investors, and tech enthusiasts receiving our weekly newsletter with the latest startup insights.
          </p>
          <div className="max-w-md mx-auto">
            <NewsletterForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
