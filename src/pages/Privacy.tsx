
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Privacy = () => {
  const lastUpdated = "April 21, 2023";
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Privacy Policy</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Last updated: {lastUpdated}</p>
            
            <div className="prose dark:prose-invert max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">1. Introduction</h2>
                <p className="mb-4">
                  MoveSmart ("we", "our", "us") respects your privacy and is committed to protecting your personal data. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or subscribe to our newsletter.
                </p>
                <p className="mb-4">
                  We adhere to the requirements of the General Data Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA), 
                  and the India Digital Personal Data Protection Act, as well as other applicable data protection laws.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">2. Information We Collect</h2>
                <p className="mb-4">We may collect the following categories of personal information:</p>
                <ul className="list-disc ml-6 mb-4">
                  <li className="mb-2">Contact information (such as name, email address, country)</li>
                  <li className="mb-2">Professional information (such as job role, company)</li>
                  <li className="mb-2">Preferences and interests</li>
                  <li className="mb-2">Usage data (such as how you interact with our website)</li>
                  <li className="mb-2">Device information (such as IP address, browser type)</li>
                </ul>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">3. How We Use Your Information</h2>
                <p className="mb-4">We use your information for the following purposes:</p>
                <ul className="list-disc ml-6 mb-4">
                  <li className="mb-2">To deliver our newsletter to you</li>
                  <li className="mb-2">To personalize your experience on our website</li>
                  <li className="mb-2">To improve our website and content</li>
                  <li className="mb-2">To respond to your inquiries</li>
                  <li className="mb-2">To send you marketing communications (with your consent)</li>
                  <li className="mb-2">To comply with legal obligations</li>
                </ul>
              </section>
              
              {/* Additional sections would continue here */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">4. Cookies and Tracking Technologies</h2>
                <p className="mb-4">
                  We use cookies and similar tracking technologies to collect information about your browsing activities. 
                  You can manage your cookie preferences through our Cookie Banner or your browser settings.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">5. Your Rights</h2>
                <p className="mb-4">Depending on your location, you may have the following rights:</p>
                <ul className="list-disc ml-6 mb-4">
                  <li className="mb-2">Right to access your personal data</li>
                  <li className="mb-2">Right to rectify inaccurate personal data</li>
                  <li className="mb-2">Right to delete your personal data</li>
                  <li className="mb-2">Right to restrict processing of your personal data</li>
                  <li className="mb-2">Right to data portability</li>
                  <li className="mb-2">Right to object to processing</li>
                  <li className="mb-2">Rights related to automated decision-making and profiling</li>
                </ul>
                <p>To exercise any of these rights, please contact us at privacy@movesmart.example.com.</p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">6. Contact Us</h2>
                <p className="mb-4">
                  If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
                </p>
                <p className="mb-4 font-medium">privacy@movesmart.example.com</p>
              </section>
            </div>
            
            <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <Link to="/terms">
                  <Button variant="outline">Terms & Conditions</Button>
                </Link>
                <Link to="/cookies">
                  <Button variant="outline">Cookie Policy</Button>
                </Link>
                <Link to="/">
                  <Button variant="default" className="bg-parrot-green hover:bg-parrot-green/90 text-white">Back to Home</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
