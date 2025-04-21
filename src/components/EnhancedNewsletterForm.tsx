
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';

interface EnhancedNewsletterFormProps {
  variant?: 'inline' | 'modal' | 'fullwidth';
  onSuccess?: () => void;
}

const regions = [
  { value: 'na', label: 'North America' },
  { value: 'eu', label: 'Europe' },
  { value: 'asia', label: 'Asia' },
  { value: 'latam', label: 'Latin America' },
  { value: 'mena', label: 'Middle East & North Africa' },
  { value: 'africa', label: 'Africa' },
  { value: 'oceania', label: 'Australia & Oceania' }
];

const roles = [
  { value: 'founder', label: 'Founder / Co-founder' },
  { value: 'executive', label: 'Executive / C-Level' },
  { value: 'investor', label: 'Investor / VC' },
  { value: 'product', label: 'Product Manager' },
  { value: 'engineer', label: 'Engineer / Developer' },
  { value: 'designer', label: 'Designer / UX' },
  { value: 'marketing', label: 'Marketing / Growth' },
  { value: 'sales', label: 'Sales / BD' },
  { value: 'hr', label: 'HR / People Ops' },
  { value: 'student', label: 'Student' },
  { value: 'other', label: 'Other' }
];

const EnhancedNewsletterForm = ({ variant = 'fullwidth', onSuccess }: EnhancedNewsletterFormProps) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [region, setRegion] = useState('');
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1);
  const { toast } = useToast();

  // Newsletter categories
  const [categories, setCategories] = useState({
    techWrap: true,
    funding: false,
    caseStudy: false,
    aiInnovation: false,
    startupProfiles: false
  });

  const handleSubmitStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email and name
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    
    // Clear error and proceed to step 2
    setError('');
    setStep(2);
  };

  const handleSubmitStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call to newsletter service (Mailchimp, Substack, etc.)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success!
      setSuccess(true);
      toast({
        title: "Successfully Subscribed!",
        description: "You've been added to our newsletter list.",
      });
      
      if (onSuccess) onSuccess();
      
      // Reset form after 1.5 seconds
      setTimeout(() => {
        setEmail('');
        setName('');
        setRegion('');
        setRole('');
        setCategories({
          techWrap: true,
          funding: false,
          caseStudy: false,
          aiInnovation: false,
          startupProfiles: false
        });
        setStep(1);
        setSuccess(false);
      }, 1500);
      
    } catch (err) {
      console.error('Newsletter subscription error:', err);
      setError('Something went wrong. Please try again.');
      toast({
        title: "Subscription Failed",
        description: "There was a problem adding you to our newsletter.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <form onSubmit={handleSubmitStep1} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input 
          id="name"
          type="text" 
          placeholder="Your name" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email"
          type="email" 
          placeholder="Your email address" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          className="w-full"
        />
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={isLoading}
      >
        Continue
      </Button>
      
      <p className="text-xs text-center text-gray-500">
        By subscribing, you agree to our <a href="/privacy" className="underline hover:text-gray-700">Privacy Policy</a> and to receive marketing emails from MoveSmart.
      </p>
    </form>
  );

  const renderStep2 = () => (
    <form onSubmit={handleSubmitStep2} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="region">Region</Label>
        <Select value={region} onValueChange={setRegion}>
          <SelectTrigger id="region" className="w-full">
            <SelectValue placeholder="Select your region" />
          </SelectTrigger>
          <SelectContent>
            {regions.map(region => (
              <SelectItem key={region.value} value={region.value}>
                {region.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="role">Professional Role</Label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger id="role" className="w-full">
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            {roles.map(role => (
              <SelectItem key={role.value} value={role.value}>
                {role.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-3">
        <Label>Newsletter Categories</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="techWrap" 
              checked={categories.techWrap} 
              onCheckedChange={(checked) => setCategories({...categories, techWrap: checked === true})}
            />
            <label htmlFor="techWrap" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Tech Wrap Weekly (main newsletter)
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="funding" 
              checked={categories.funding} 
              onCheckedChange={(checked) => setCategories({...categories, funding: checked === true})}
            />
            <label htmlFor="funding" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Funding & Deals
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="caseStudy" 
              checked={categories.caseStudy} 
              onCheckedChange={(checked) => setCategories({...categories, caseStudy: checked === true})}
            />
            <label htmlFor="caseStudy" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              In-Depth Case Studies
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="aiInnovation" 
              checked={categories.aiInnovation} 
              onCheckedChange={(checked) => setCategories({...categories, aiInnovation: checked === true})}
            />
            <label htmlFor="aiInnovation" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              AI Innovation
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="startupProfiles" 
              checked={categories.startupProfiles} 
              onCheckedChange={(checked) => setCategories({...categories, startupProfiles: checked === true})}
            />
            <label htmlFor="startupProfiles" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Startup Profiles
            </label>
          </div>
        </div>
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      
      <div className="flex space-x-2">
        <Button 
          type="button" 
          variant="outline"
          onClick={() => setStep(1)}
          disabled={isLoading}
          className="flex-1"
        >
          Back
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading || success}
          className="flex-1"
        >
          {isLoading ? 'Subscribing...' : success ? 'Subscribed!' : 'Subscribe'}
        </Button>
      </div>
    </form>
  );

  const renderInlineForm = () => (
    <div className="flex flex-col sm:flex-row gap-3">
      <Input
        type="email"
        placeholder="Your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading || success}
        className="flex-grow"
      />
      <Button 
        type="submit" 
        disabled={isLoading || success || !email}
        onClick={async (e) => {
          e.preventDefault();
          if (!email) return;
          
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            toast({
              title: "Invalid email",
              description: "Please enter a valid email address",
              variant: "destructive",
            });
            return;
          }
          
          setIsLoading(true);
          await new Promise(resolve => setTimeout(resolve, 800));
          setIsLoading(false);
          setSuccess(true);
          toast({
            title: "Thanks for subscribing!",
            description: "Check your inbox to confirm your subscription.",
          });
          if (onSuccess) onSuccess();
        }}
      >
        {isLoading ? 'Subscribing...' : success ? 'Subscribed!' : 'Subscribe'}
      </Button>
    </div>
  );

  if (variant === 'inline') {
    return renderInlineForm();
  }

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-lg ${variant === 'modal' ? 'p-0' : 'p-6 shadow-md'}`}>
      {step === 1 ? renderStep1() : renderStep2()}
    </div>
  );
};

export default EnhancedNewsletterForm;
