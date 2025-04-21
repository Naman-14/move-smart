
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Terms = () => {
  const lastUpdated = "April 21, 2023";
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Terms & Conditions</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Last updated: {lastUpdated}</p>
            
            <div className="prose dark:prose-invert max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">1. Introduction</h2>
                <p className="mb-4">
                  Welcome to MoveSmart! These Terms and Conditions ("Terms") govern your use of our website located at movesmart.example.com (the "Website") 
                  and our newsletter services (collectively, the "Services").
                </p>
                <p className="mb-4">
                  By accessing our Website or subscribing to our newsletter, you agree to be bound by these Terms. If you disagree with any part of the Terms, 
                  you may not access the Services.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">2. Intellectual Property</h2>
                <p className="mb-4">
                  The Website and its original content, features, and functionality are and will remain the exclusive property of MoveSmart. 
                  Our Services are protected by copyright, trademark, and other intellectual property laws.
                </p>
                <p className="mb-4">
                  You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, 
                  or transmit any of the material on our Website, except as follows:
                </p>
                <ul className="list-disc ml-6 mb-4">
                  <li className="mb-2">Your computer may temporarily store copies of such materials incidental to your accessing and viewing those materials.</li>
                  <li className="mb-2">You may store files that are automatically cached by your Web browser for display enhancement purposes.</li>
                  <li className="mb-2">You may print or download one copy of a reasonable number of pages of the Website for your own personal, non-commercial use and not for further reproduction, publication, or distribution.</li>
                </ul>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">3. User Content</h2>
                <p className="mb-4">
                  Our Services may allow you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material. 
                  By providing such content, you grant us the right to use, modify, publicly perform, publicly display, reproduce, and distribute such content on and through our Services.
                </p>
                <p className="mb-4">
                  You agree not to post content that is illegal, defamatory, harassing, threatening, or infringing on intellectual property rights.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">4. Newsletter Subscription</h2>
                <p className="mb-4">
                  By subscribing to our newsletter, you agree to receive periodic emails from MoveSmart. You can unsubscribe at any time 
                  by clicking the unsubscribe link at the bottom of any newsletter email or by contacting us directly.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">5. Limitation of Liability</h2>
                <p className="mb-4">
                  In no event shall MoveSmart be liable for any indirect, punitive, special, incidental or consequential damage (including loss of business, revenue, 
                  profits, use, data or other economic advantage), however it arises, whether in an action of contract, negligence or other tortious action, 
                  arising out of or in connection with the use of the Services.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">6. Governing Law</h2>
                <p className="mb-4">
                  These Terms shall be governed by and construed in accordance with the laws of [Your Country], 
                  without regard to its conflict of law provisions.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">7. Changes to Terms</h2>
                <p className="mb-4">
                  We reserve the right to modify or replace these Terms at any time. We will provide notice of any changes 
                  by updating the "Last updated" date at the top of this page.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">8. Contact Us</h2>
                <p className="mb-4">
                  If you have any questions about these Terms, please contact us at:
                </p>
                <p className="mb-4 font-medium">terms@movesmart.example.com</p>
              </section>
            </div>
            
            <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <Link to="/privacy">
                  <Button variant="outline">Privacy Policy</Button>
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

export default Terms;
