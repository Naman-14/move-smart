
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Cookies = () => {
  const lastUpdated = "April 21, 2023";
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Cookie Policy</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Last updated: {lastUpdated}</p>
            
            <div className="prose dark:prose-invert max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">1. What Are Cookies</h2>
                <p className="mb-4">
                  Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
                  They are widely used to make websites work more efficiently and provide information to the website owners.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">2. How We Use Cookies</h2>
                <p className="mb-4">We use cookies for the following purposes:</p>
                <ul className="list-disc ml-6 mb-4">
                  <li className="mb-2">
                    <strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and account access.
                  </li>
                  <li className="mb-2">
                    <strong>Analytics Cookies:</strong> These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.
                  </li>
                  <li className="mb-2">
                    <strong>Marketing Cookies:</strong> These cookies are used to track visitors across websites. They are set to display targeted advertisements based on your interests.
                  </li>
                  <li className="mb-2">
                    <strong>Preference Cookies:</strong> These cookies enable a website to remember information that changes how the website behaves or looks, like your preferred language or the region you are in.
                  </li>
                </ul>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">3. How to Control Cookies</h2>
                <p className="mb-4">
                  You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed.
                  If you do this, however, you may have to manually adjust some preferences every time you visit a site and some services and functionalities may not work.
                </p>
                <p className="mb-4">
                  You can manage your cookie preferences through our Cookie Banner or adjust your browser settings. For more information about how to manage cookies, please visit: 
                  <a href="https://www.allaboutcookies.org/manage-cookies/" target="_blank" rel="noopener noreferrer" className="text-parrot-blue hover:underline"> www.allaboutcookies.org/manage-cookies/</a>.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">4. Types of Cookies We Use</h2>
                <table className="min-w-full border border-gray-300 dark:border-gray-700 mb-4">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800">
                      <th className="border border-gray-300 dark:border-gray-700 p-2 text-left">Category</th>
                      <th className="border border-gray-300 dark:border-gray-700 p-2 text-left">Purpose</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">Essential</td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        Authentication, security, basic functionality
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">Analytics</td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        Visitor counting, traffic source tracking, performance measurement
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">Marketing</td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        Advertising personalization, cross-site tracking
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">Preferences</td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        Language selection, theme preference, other user customizations
                      </td>
                    </tr>
                  </tbody>
                </table>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">5. Third-Party Cookies</h2>
                <p className="mb-4">
                  In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the Service, 
                  deliver advertisements on and through the Service, and so on.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">6. Contact Us</h2>
                <p className="mb-4">
                  If you have any questions about our use of cookies, please contact us at:
                </p>
                <p className="mb-4 font-medium">privacy@movesmart.example.com</p>
              </section>
            </div>
            
            <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <Link to="/privacy">
                  <Button variant="outline">Privacy Policy</Button>
                </Link>
                <Link to="/terms">
                  <Button variant="outline">Terms & Conditions</Button>
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

export default Cookies;
