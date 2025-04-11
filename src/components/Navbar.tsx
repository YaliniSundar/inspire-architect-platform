
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
import { HomeIcon, SearchIcon, CompassIcon, SparklesIcon, UserIcon, LogOutIcon, ArrowLeft, BookmarkIcon, UsersIcon, ImageIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import React from 'react';

interface NavbarProps {
  logo?: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ logo }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're on a page that needs a back button
  const needsBackButton = ['/verify-otp', '/create-password', '/architect-profile'].includes(location.pathname);
  
  const handleLogout = () => {
    logout();
    navigate('/');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Determine if user is architect or homeowner
  const isArchitect = user?.userType === 'architect';
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          {needsBackButton && (
            <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
              <ArrowLeft className="h-4 w-4" />
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
          
          {isAuthenticated ? (
            <>
              {isArchitect ? (
                // Architect navigation
                <>
                  <Link to="/architect-dashboard" className="flex items-center gap-2 text-sm font-medium">
                    <ImageIcon className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link to="/explore" className="flex items-center gap-2 text-sm font-medium">
                    <CompassIcon className="h-4 w-4" />
                    Explore
                  </Link>
                </>
              ) : (
                // Homeowner navigation
                <>
                  <Link to="/homeowner-dashboard" className="flex items-center gap-2 text-sm font-medium">
                    <BookmarkIcon className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link to="/architects" className="flex items-center gap-2 text-sm font-medium">
                    <UsersIcon className="h-4 w-4" />
                    Architects
                  </Link>
                  <Link to="/ai-generator" className="flex items-center gap-2 text-sm font-medium">
                    <SparklesIcon className="h-4 w-4" />
                    AI Generator
                  </Link>
                </>
              )}
            </>
          ) : (
            <Button variant="ghost" size="sm" asChild className="gap-2">
              <Link to="/login">
                <CompassIcon className="h-4 w-4" />
                Explore Designs
              </Link>
            </Button>
          )}
        </div>

        {isAuthenticated && (
          <div className="hidden md:flex relative w-full max-w-sm items-center mx-4">
            <SearchIcon className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={isArchitect ? "Search designs, architects..." : "Search for inspiration..."}
              className="pl-8 bg-background"
            />
          </div>
        )}

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <UserIcon className="h-5 w-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  <p className="text-xs leading-none text-muted-foreground capitalize">{user?.userType}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={`/profile/${user?.id}`} className="w-full cursor-pointer">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="w-full cursor-pointer">
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/login">Log in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/signup">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
