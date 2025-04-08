
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";

const PrivacyPolicyPage = () => {
  const [accepted, setAccepted] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (accepted) {
      toast({
        title: "Privacy Policy Accepted",
        description: "You have successfully agreed to our Privacy Policy.",
      });
      navigate('/');
    }
  };
  
  return (
    <div className="container py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <ScrollArea className="h-[50vh] border rounded-md p-4 mb-6">
        <div className="space-y-4 p-2">
          <h2 className="text-xl font-semibold">1. Introduction</h2>
          <p>Your privacy is important to us. This Privacy Policy explains how Design Next collects, uses, and discloses your personal information.</p>
          
          <h2 className="text-xl font-semibold">2. Information We Collect</h2>
          <p><strong>Personal Information:</strong> Name, email address, contact details, and professional information.</p>
          <p><strong>Usage Data:</strong> Information on how you use our platform, including designs viewed, interactions, and preferences.</p>
          <p><strong>Technical Data:</strong> IP address, browser type, device information, and cookies.</p>
          
          <h2 className="text-xl font-semibold">3. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Provide and maintain our service</li>
            <li>Improve and personalize your experience</li>
            <li>Communicate with you about updates and changes</li>
            <li>Process transactions and payments</li>
            <li>Detect and prevent fraudulent activities</li>
          </ul>
          
          <h2 className="text-xl font-semibold">4. Data Sharing and Disclosure</h2>
          <p>We may share your information with:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Service providers who perform services on our behalf</li>
            <li>Legal authorities when required by law</li>
            <li>Business partners with your consent</li>
          </ul>
          
          <h2 className="text-xl font-semibold">5. Data Security</h2>
          <p>We implement appropriate security measures to protect your personal information, but no method of transmission over the internet is 100% secure.</p>
          
          <h2 className="text-xl font-semibold">6. Your Rights</h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Delete your information</li>
            <li>Object to processing of your information</li>
            <li>Data portability</li>
          </ul>
          
          <h2 className="text-xl font-semibold">7. Children's Privacy</h2>
          <p>Our services are not directed to individuals under 16 years of age. We do not knowingly collect personal information from children.</p>
          
          <h2 className="text-xl font-semibold">8. Changes to This Privacy Policy</h2>
          <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
          
          <h2 className="text-xl font-semibold">9. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at privacy@designnext.com.</p>
        </div>
      </ScrollArea>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="privacy" 
            checked={accepted} 
            onCheckedChange={() => setAccepted(!accepted)}
          />
          <label
            htmlFor="privacy"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I have read and agree to the Privacy Policy
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

export default PrivacyPolicyPage;
