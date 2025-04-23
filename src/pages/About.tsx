
import PageTemplate from '@/components/PageTemplate';

const About = () => {
  return (
    <PageTemplate>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">About MoveSmart</h1>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg mb-6">
              MoveSmart is the leading platform for tracking innovation and growth in the startup ecosystem.
              Our mission is to provide actionable insights and data that help founders, investors, and tech
              enthusiasts make informed decisions.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Our Story</h2>
            <p className="mb-4">
              Founded in 2023, MoveSmart emerged from the recognition that the startup landscape was becoming 
              increasingly complex and difficult to navigate. Our founding team of tech industry veterans and
              data scientists set out to create a platform that would bring transparency and clarity to the
              innovation economy.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Our Approach</h2>
            <p className="mb-4">
              We combine advanced data analytics with expert human curation to deliver insights that matter.
              Our team tracks thousands of startups, funding rounds, and industry trends to identify patterns
              and opportunities that others might miss.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Our Team</h2>
            <p className="mb-4">
              MoveSmart is powered by a team of passionate technologists, researchers, and industry experts
              who share a common goal: to make the startup ecosystem more accessible and transparent for everyone.
            </p>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default About;
