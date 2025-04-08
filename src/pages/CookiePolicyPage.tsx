
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const CookiePolicyPage = () => {
  return (
    <div className="container py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>
      
      <ScrollArea className="h-[60vh] border rounded-md p-4 mb-6">
        <div className="space-y-4 p-2">
          <h2 className="text-xl font-semibold">What Are Cookies</h2>
          <p>Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners.</p>
          
          <h2 className="text-xl font-semibold">How We Use Cookies</h2>
          <p>We use cookies for several reasons:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Essential Cookies:</strong> Required for the operation of our website, such as logging in or completing forms.</li>
            <li><strong>Analytics Cookies:</strong> Allow us to analyze how visitors use our site, helping us improve its structure and content.</li>
            <li><strong>Functional Cookies:</strong> Remember your preferences such as language or region to enhance your experience.</li>
            <li><strong>Targeting Cookies:</strong> Record your visit to our website, the pages you visited, and the links you followed to make our advertising more relevant to your interests.</li>
          </ul>
          
          <h2 className="text-xl font-semibold">Types of Cookies We Use</h2>
          
          <h3 className="text-lg font-medium">Session Cookies</h3>
          <p>These are temporary cookies that exist only during your website session. They are deleted when you close your browser.</p>
          
          <h3 className="text-lg font-medium">Persistent Cookies</h3>
          <p>These remain on your device even after you close your browser, allowing websites to remember your preferences for your next visit.</p>
          
          <h3 className="text-lg font-medium">First-Party Cookies</h3>
          <p>These are cookies set by our website that you are visiting.</p>
          
          <h3 className="text-lg font-medium">Third-Party Cookies</h3>
          <p>These are cookies set by domains other than our website, such as analytics services or advertising networks.</p>
          
          <h2 className="text-xl font-semibold">Managing Cookies</h2>
          <p>Most web browsers allow you to control cookies through their settings. You can usually find these settings in the "options" or "preferences" menu of your browser. You can also use tools like the following to manage cookies:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Delete all cookies</li>
            <li>Block all cookies</li>
            <li>Allow all cookies</li>
            <li>Block third-party cookies</li>
            <li>Clear all cookies when you close the browser</li>
          </ul>
          
          <p>Please note that restricting cookies may impact your experience on our website and may limit your ability to use certain features.</p>
          
          <h2 className="text-xl font-semibold">Changes to Our Cookie Policy</h2>
          <p>We may update our Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.</p>
          
          <h2 className="text-xl font-semibold">Contact Us</h2>
          <p>If you have any questions about our Cookie Policy, please contact us at cookies@designnext.com.</p>
        </div>
      </ScrollArea>
      
      <div className="flex gap-4">
        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/privacy-policy">Privacy Policy</Link>
        </Button>
      </div>
    </div>
  );
};

export default CookiePolicyPage;
