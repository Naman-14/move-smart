
import Header from './Header';
import Footer from './Footer';

interface PageTemplateProps {
  children: React.ReactNode;
  className?: string;
}

const PageTemplate = ({ children, className = "" }: PageTemplateProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950">
      <Header />
      <main className={`flex-grow ${className}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PageTemplate;
