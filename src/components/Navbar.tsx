
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { HomeIcon, SearchIcon, CompassIcon, SparklesIcon, UserIcon, BookmarkIcon, ImageIcon, MessageSquare } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import React, { useState } from 'react';
import NotificationsDropdown from './notifications/NotificationsDropdown';
import { Badge } from "@/components/ui/badge";

interface NavbarProps {
  logo?: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ logo }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  // Check if we're on a page that needs a back button
  const needsBackButton = ['/architect-profile'].includes(location.pathname);

  const handleBack = () => {
    navigate(-1);
  };
  
  // Mock user for demo purposes
  const mockUser = {
    id: "demo-user",
    name: "Demo User",
    email: "demo@example.com",
    userType: "homeowner",
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          {needsBackButton && (
            <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
              <span className="sr-only">Back</span>
            </Button>
          )}
          <Link to="/" className="flex items-center gap-2">
            {logo ? (
              logo
            ) : (
              <span className="hidden font-bold text-xl sm:inline-block hero-gradient bg-clip-text text-transparent">
                Design Next
              </span>
            )}
          </Link>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 text-sm font-medium">
            <HomeIcon className="h-4 w-4" />
            Home
          </Link>

          <Link to="/homeowner-dashboard" className="flex items-center gap-2 text-sm font-medium">
            <BookmarkIcon className="h-4 w-4" />
            Dashboard
          </Link>
          <Link to="/explore" className="flex items-center gap-2 text-sm font-medium">
            <CompassIcon className="h-4 w-4" />
            Explore
          </Link>
          <Link to="/ai-generator" className="flex items-center gap-2 text-sm font-medium">
            <SparklesIcon className="h-4 w-4" />
            AI Generator
          </Link>
        </div>

        <div className="hidden md:flex relative w-full max-w-sm items-center mx-4">
          <SearchIcon className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for inspiration..."
            className="pl-8 bg-background"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link to="/messages">
              <MessageSquare className="h-5 w-5" />
              {unreadMessagesCount > 0 && (
                <Badge className="absolute -top-1 -right-1 px-1 min-w-[1.25rem] h-5 flex items-center justify-center">
                  {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                </Badge>
              )}
            </Link>
          </Button>
          
          <NotificationsDropdown />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <UserIcon className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-sm font-medium leading-none">{mockUser.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{mockUser.email}</p>
                <p className="text-xs leading-none text-muted-foreground capitalize">{mockUser.userType}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={`/profile/${mockUser.id}`} className="w-full cursor-pointer">
                  Your Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="w-full cursor-pointer">
                  Settings
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
