
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { HomeIcon, SearchIcon, CompassIcon, SparklesIcon, UserIcon } from 'lucide-react';

const Navbar = () => {
  // Mock authentication state - would come from auth context in a real app
  const isAuthenticated = false;
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="hidden font-bold text-xl sm:inline-block hero-gradient bg-clip-text text-transparent">
              Design Next
            </span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 text-sm font-medium">
            <HomeIcon className="h-4 w-4" />
            Home
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
            placeholder="Search designs, architects..."
            className="pl-8 bg-background"
          />
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <UserIcon className="h-5 w-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link to="/profile/me" className="w-full">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Log in</Button>
              <Button size="sm">Sign up</Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
