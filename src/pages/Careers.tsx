
import PageTemplate from '@/components/PageTemplate';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Briefcase, Clock } from 'lucide-react';

const jobOpenings = [
  {
    id: 1,
    title: 'Frontend Developer',
    department: 'Engineering',
    location: 'San Francisco, CA',
    type: 'Full-time',
    description: 'We are looking for a skilled frontend developer experienced in React and TypeScript to join our growing team.',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'UI/UX']
  },
  {
    id: 2,
    title: 'Data Analyst',
    department: 'Data',
    location: 'Remote',
    type: 'Full-time',
    description: 'Join our data team to help analyze startup funding trends and provide actionable insights for our platform.',
    skills: ['SQL', 'Python', 'Data Visualization', 'Statistics']
  },
  {
    id: 3,
    title: 'Content Writer',
    department: 'Content',
    location: 'New York, NY',
    type: 'Part-time',
    description: 'Create compelling content about startup trends, funding news, and technology innovations for our global audience.',
    skills: ['Content Strategy', 'SEO', 'Journalism', 'Tech Industry Knowledge']
  }
];

const Careers = () => {
  return (
    <PageTemplate>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-center">Join Our Team</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-12">
            We're building the definitive platform for startup intelligence and we're looking for passionate individuals to join us.
          </p>
          
          <div className="bg-parrot-soft-green dark:bg-parrot-green/20 rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Why Work With Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <h3 className="font-semibold text-lg mb-2">Mission-Driven</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We're making the startup ecosystem more transparent and accessible for everyone.
                </p>
              </div>
              <div className="flex flex-col">
                <h3 className="font-semibold text-lg mb-2">Growth Opportunities</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Learn and develop your skills in a fast-paced, innovative environment.
                </p>
              </div>
              <div className="flex flex-col">
                <h3 className="font-semibold text-lg mb-2">Flexible Work</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Remote-friendly with flexible hours and work-life balance.
                </p>
              </div>
              <div className="flex flex-col">
                <h3 className="font-semibold text-lg mb-2">Competitive Benefits</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Health insurance, paid time off, and equity options for all employees.
                </p>
              </div>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-6">Open Positions</h2>
          
          <div className="space-y-6">
            {jobOpenings.map(job => (
              <div key={job.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{job.title}</h3>
                    <p className="text-parrot-green font-medium mb-2">{job.department}</p>
                  </div>
                  <Button className="mt-4 md:mt-0 bg-parrot-green hover:bg-parrot-green/90 text-white">
                    Apply Now
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-1" />
                    <span>{job.department}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{job.type}</span>
                  </div>
                </div>
                
                <p className="mb-4 text-gray-700 dark:text-gray-300">{job.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="bg-gray-100 dark:bg-gray-700">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <h3 className="text-xl font-bold mb-4">Don't see a position for you?</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              We're always looking for talented individuals to join our team. Send us your resume and tell us why you'd be a good fit!
            </p>
            <Button className="bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
              Send Open Application
            </Button>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default Careers;
