
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface NewsletterFormProps {
  variant?: 'default' | 'inline' | 'modal';
  onSuccess?: () => void;
}

const NewsletterForm = ({ variant = 'default', onSuccess }: NewsletterFormProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Success!
      setSuccess(true);
      setEmail('');
      if (onSuccess) onSuccess();

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderForm = () => {
    if (variant === 'inline') {
      return (
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="min-w-64"
            required
            disabled={isLoading || success}
          />
          <Button 
            type="submit" 
            className="btn-primary" 
            disabled={isLoading || success}
          >
            {isLoading ? 'Subscribing...' : success ? 'Subscribed!' : 'Subscribe'}
          </Button>
        </div>
      );
    }

    if (variant === 'modal') {
      return (
        <div className="space-y-4">
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
            required
            disabled={isLoading || success}
          />
          <Button 
            type="submit" 
            className="w-full btn-primary"
            disabled={isLoading || success}
          >
            {isLoading ? 'Subscribing...' : success ? 'Subscribed!' : 'Subscribe'}
          </Button>
        </div>
      );
    }

    // Default form
    return (
      <div className="max-w-md space-y-4">
        <Input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full"
          required
          disabled={isLoading || success}
        />
        <Button 
          type="submit" 
          className="w-full btn-primary"
          disabled={isLoading || success}
        >
          {isLoading ? 'Subscribing...' : success ? 'Subscribed!' : 'Subscribe to MoveSmart'}
        </Button>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      {renderForm()}
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
      
      {success && variant !== 'inline' && (
        <p className="mt-2 text-sm text-parrot-green">
          Thank you for subscribing to our newsletter!
        </p>
      )}
    </form>
  );
};

export default NewsletterForm;
