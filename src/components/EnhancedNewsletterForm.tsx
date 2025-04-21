
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

interface EnhancedNewsletterFormProps {
  variant?: 'default' | 'inline' | 'modal';
  onSuccess?: () => void;
}

const countryOptions = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'in', label: 'India' },
  { value: 'jp', label: 'Japan' },
  { value: 'sg', label: 'Singapore' },
  { value: 'other', label: 'Other' }
];

const roleOptions = [
  { value: 'founder', label: 'Founder / Co-founder' },
  { value: 'investor', label: 'Investor' },
  { value: 'executive', label: 'Executive / Manager' },
  { value: 'developer', label: 'Developer / Engineer' },
  { value: 'marketer', label: 'Marketing / Sales' },
  { value: 'researcher', label: 'Researcher / Academic' },
  { value: 'student', label: 'Student' },
  { value: 'other', label: 'Other' }
];

const interestOptions = [
  { id: 'ai', label: 'Artificial Intelligence' },
  { id: 'saas', label: 'SaaS' },
  { id: 'fintech', label: 'FinTech' },
  { id: 'healthtech', label: 'Health Tech' },
  { id: 'cleantech', label: 'Clean Tech' },
  { id: 'edtech', label: 'EdTech' },
  { id: 'ecommerce', label: 'E-Commerce' }
];

const EnhancedNewsletterForm = ({ variant = 'default', onSuccess }: EnhancedNewsletterFormProps) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [role, setRole] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  
  const [formStep, setFormStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formStep === 0) {
      // First step validation - just email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email address');
        return;
      }
      setError('');
      setFormStep(1);
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Log the data that would be sent to the server
      console.log({
        email,
        name,
        country,
        role,
        interests
      });
      
      // Success!
      setSuccess(true);
      toast({
        title: "Subscription successful!",
        description: "Thank you for subscribing to our newsletter.",
      });
      
      // Reset form
      setEmail('');
      setName('');
      setCountry('');
      setRole('');
      setInterests([]);
      setFormStep(0);
      
      if (onSuccess) onSuccess();
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleInterest = (id: string) => {
    setInterests(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  // Initial step - just email
  if (formStep === 0) {
    return (
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className={variant === 'inline' ? "flex flex-col sm:flex-row gap-2" : "space-y-3"}>
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={variant === 'inline' ? "min-w-64" : "w-full"}
              required
            />
            <Button 
              type="submit" 
              className="btn-primary bg-parrot-green hover:bg-parrot-green/90 text-white"
              disabled={isLoading}
              {...(variant === 'inline' ? {} : { className: "w-full btn-primary bg-parrot-green hover:bg-parrot-green/90 text-white" })}
            >
              Continue
            </Button>
          </div>
          
          {error && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            By continuing, you agree to our <a href="/privacy" className="underline hover:text-parrot-blue">Privacy Policy</a> and <a href="/terms" className="underline hover:text-parrot-blue">Terms of Service</a>.
          </p>
        </div>
      </form>
    );
  }
  
  // Second step - detailed information
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-3">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mt-1"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="country">Country</Label>
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Select your country" />
            </SelectTrigger>
            <SelectContent>
              {countryOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="role">Your Role</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="block mb-2">Interests (select all that apply)</Label>
          <div className="grid grid-cols-2 gap-2">
            {interestOptions.map(option => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`interest-${option.id}`} 
                  checked={interests.includes(option.id)}
                  onCheckedChange={() => toggleInterest(option.id)}
                />
                <label 
                  htmlFor={`interest-${option.id}`}
                  className="text-sm cursor-pointer"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2 pt-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => setFormStep(0)}
          className="flex-1"
          disabled={isLoading}
        >
          Back
        </Button>
        <Button 
          type="submit" 
          className="flex-1 btn-primary bg-parrot-green hover:bg-parrot-green/90 text-white"
          disabled={isLoading}
        >
          {isLoading ? 'Subscribing...' : success ? 'Subscribed!' : 'Subscribe'}
        </Button>
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </form>
  );
};

export default EnhancedNewsletterForm;
