
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-2">
              <span className="font-bold text-xl hero-gradient bg-clip-text text-transparent">
                Design Next
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Connect with architects and find inspiration for your dream home.
            </p>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/explore" className="text-sm text-muted-foreground hover:text-foreground">
                  Explore Designs
                </Link>
              </li>
              <li>
                <Link to="/ai-generator" className="text-sm text-muted-foreground hover:text-foreground">
                  AI Generator
                </Link>
              </li>
              <li>
                <span className="text-sm text-muted-foreground hover:text-foreground">
                  For Architects
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground hover:text-foreground">
                  For Homeowners
                </span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium">Company</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-muted-foreground hover:text-foreground">
                  About Us
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground hover:text-foreground">
                  Careers
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground hover:text-foreground">
                  Blog
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground hover:text-foreground">
                  Contact
                </span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium">Legal</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-muted-foreground hover:text-foreground">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground hover:text-foreground">
                  Cookie Policy
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Design Next. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">
              Follow us:
            </span>
            <div className="flex items-center gap-2">
              <span className="sr-only">Social Media Links</span>
              {/* Social media icons would go here */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
