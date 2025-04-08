
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";

const TermsOfServicePage = () => {
  const [accepted, setAccepted] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (accepted) {
      toast({
        title: "Terms Accepted",
        description: "You have successfully agreed to our Terms of Service.",
      });
      navigate('/');
    }
  };
  
  return (
    <div className="container py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      
      <ScrollArea className="h-[50vh] border rounded-md p-4 mb-6">
        <div className="space-y-4 p-2">
          <h2 className="text-xl font-semibold">1. Introduction</h2>
          <p>Welcome to Design Next. By using our platform, you agree to these Terms of Service. Please read them carefully.</p>
          
          <h2 className="text-xl font-semibold">2. Definitions</h2>
          <p>"Platform" refers to Design Next website and services.</p>
          <p>"User", "You", and "Your" refers to the individual or entity using our Platform.</p>
          <p>"Content" refers to designs, comments, profiles, and other materials you may view or access on the Platform.</p>
          
          <h2 className="text-xl font-semibold">3. Account Registration</h2>
          <p>To use certain features of the Platform, you must register for an account. You agree to provide accurate information during the registration process.</p>
          <p>You are responsible for maintaining the security of your account and password.</p>
          
          <h2 className="text-xl font-semibold">4. User Responsibilities</h2>
          <p>You agree not to use the Platform for any illegal purposes or in violation of any local, state, national, or international law.</p>
          <p>You will not upload, post, or otherwise transmit any content that infringes any rights of any party.</p>
          
          <h2 className="text-xl font-semibold">5. Intellectual Property</h2>
          <p>The Platform and its original content, features, and functionality are owned by Design Next and are protected by international copyright, trademark, and other intellectual property laws.</p>
          
          <h2 className="text-xl font-semibold">6. User Content</h2>
          <p>By posting content on our Platform, you grant us the right to use, reproduce, modify, and distribute your content.</p>
          <p>You retain all ownership rights to your content.</p>
          
          <h2 className="text-xl font-semibold">7. Termination</h2>
          <p>We may terminate or suspend your account at any time, without prior notice or liability, for any reason.</p>
          
          <h2 className="text-xl font-semibold">8. Changes to Terms</h2>
          <p>We reserve the right to modify or replace these Terms at any time. It is your responsibility to review our Terms periodically.</p>
          
          <h2 className="text-xl font-semibold">9. Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at support@designnext.com.</p>
        </div>
      </ScrollArea>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="terms" 
            checked={accepted} 
            onCheckedChange={() => setAccepted(!accepted)}
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I have read and agree to the Terms of Service
          </label>
        </div>
        
        <div className="flex gap-4">
          <Button type="submit" disabled={!accepted}>Accept</Button>
          <Button type="button" variant="outline" onClick={() => navigate('/')}>
            Decline
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TermsOfServicePage;
