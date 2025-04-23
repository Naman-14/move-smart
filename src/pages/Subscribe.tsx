
import { useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const Subscribe = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    company: '',
    frequency: 'weekly',
    interestCategories: {
      ai: false,
      fintech: false,
      saas: false,
      cleantech: false,
      healthtech: false
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (category: keyof typeof formData.interestCategories) => {
    setFormData(prev => ({
      ...prev,
      interestCategories: {
        ...prev.interestCategories,
        [category]: !prev.interestCategories[category]
      }
    }));
  };

  const handleFrequencyChange = (value: string) => {
    setFormData(prev => ({ ...prev, frequency: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Subscription successful!",
      description: "Thank you for subscribing to our newsletter.",
    });
    // Reset form
    setFormData({
      email: '',
      firstName: '',
      lastName: '',
      company: '',
      frequency: 'weekly',
      interestCategories: {
        ai: false,
        fintech: false,
        saas: false,
        cleantech: false,
        healthtech: false
      }
    });
  };

  return (
    <PageTemplate>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Subscribe to MoveSmart</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Get the latest insights on startups, funding, and innovation delivered to your inbox.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 border border-gray-100 dark:border-gray-700">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-sm font-medium mb-2">
                    Company Name (Optional)
                  </label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Your organization"
                  />
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-3">Delivery Frequency</h3>
                  <RadioGroup value={formData.frequency} onValueChange={handleFrequencyChange} className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="daily" id="daily" />
                      <Label htmlFor="daily">Daily - Get updates every weekday</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="weekly" id="weekly" />
                      <Label htmlFor="weekly">Weekly - Every Friday with the week's top stories</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="monthly" id="monthly" />
                      <Label htmlFor="monthly">Monthly - Comprehensive monthly roundup</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-3">Areas of Interest</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    Select topics you're interested in to receive tailored content
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="ai" 
                        checked={formData.interestCategories.ai}
                        onCheckedChange={() => handleCheckboxChange('ai')}
                      />
                      <label htmlFor="ai" className="text-sm">Artificial Intelligence</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="fintech" 
                        checked={formData.interestCategories.fintech}
                        onCheckedChange={() => handleCheckboxChange('fintech')}
                      />
                      <label htmlFor="fintech" className="text-sm">FinTech</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="saas" 
                        checked={formData.interestCategories.saas}
                        onCheckedChange={() => handleCheckboxChange('saas')}
                      />
                      <label htmlFor="saas" className="text-sm">SaaS</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="cleantech" 
                        checked={formData.interestCategories.cleantech}
                        onCheckedChange={() => handleCheckboxChange('cleantech')}
                      />
                      <label htmlFor="cleantech" className="text-sm">CleanTech</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="healthtech" 
                        checked={formData.interestCategories.healthtech}
                        onCheckedChange={() => handleCheckboxChange('healthtech')}
                      />
                      <label htmlFor="healthtech" className="text-sm">HealthTech</label>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button type="submit" className="w-full bg-parrot-green hover:bg-parrot-green/90 text-white">
                    Subscribe Now
                  </Button>
                </div>
                
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  By subscribing, you agree to our <a href="/privacy" className="underline">Privacy Policy</a> and 
                  <a href="/terms" className="underline"> Terms of Service</a>. You can unsubscribe at any time.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default Subscribe;
