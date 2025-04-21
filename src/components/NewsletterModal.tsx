
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import NewsletterForm from './NewsletterForm';

interface NewsletterModalProps {
  delayInSeconds?: number;
}

const NewsletterModal = ({ delayInSeconds = 5 }: NewsletterModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    // Check if user has already seen the popup
    const hasSeenPopup = localStorage.getItem('newsletter_popup_seen');
    
    if (!hasSeenPopup) {
      // Show popup after delay
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, delayInSeconds * 1000);
      
      return () => clearTimeout(timer);
    }
  }, [delayInSeconds]);
  
  const handleClose = () => {
    setIsOpen(false);
    // Set flag in localStorage so we don't show the popup again soon
    localStorage.setItem('newsletter_popup_seen', 'true');
    
    // Reset after 7 days
    setTimeout(() => {
      localStorage.removeItem('newsletter_popup_seen');
    }, 7 * 24 * 60 * 60 * 1000);
  };
  
  const handleSuccess = () => {
    // Close modal after successful subscription with small delay
    setTimeout(() => {
      setIsOpen(false);
      localStorage.setItem('newsletter_subscribed', 'true');
    }, 1500);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Stay Ahead with MoveSmart
          </DialogTitle>
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-center text-gray-600 mb-6">
            Join thousands of tech enthusiasts and startup founders. Get the latest startup news, case studies, and funding updates delivered to your inbox every week.
          </p>
          
          <NewsletterForm variant="modal" onSuccess={handleSuccess} />
          
          <p className="text-xs text-center text-gray-500 mt-4">
            By subscribing, you agree to our Privacy Policy and Terms of Service.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewsletterModal;
