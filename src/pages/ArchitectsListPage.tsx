
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SearchIcon, MapPinIcon, StarIcon, FilterIcon } from 'lucide-react';

// Mock data for architects
const ARCHITECTS = [
  {
    id: 'a1',
    name: 'Sarah Johnson',
    avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    location: 'New York, USA',
    yearsOfExperience: 8,
    rating: 4.8,
    reviews: 26,
    specialties: ['Modern', 'Minimalist', 'Residential'],
  },
  {
    id: 'a2',
    name: 'Michael Chen',
    avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    location: 'San Francisco, USA',
    yearsOfExperience: 12,
    rating: 4.9,
    reviews: 48,
    specialties: ['Commercial', 'Sustainable', 'Urban'],
  },
  {
    id: 'a3',
    name: 'Emma Rodriguez',
    avatarUrl: 'https://randomuser.me/api/portraits/women/63.jpg',
    location: 'Chicago, USA',
    yearsOfExperience: 5,
    rating: 4.6,
    reviews: 15,
    specialties: ['Renovation', 'Interior', 'Small Spaces'],
  },
  {
    id: 'a4',
    name: 'David Thompson',
    avatarUrl: 'https://randomuser.me/api/portraits/men/52.jpg',
    location: 'Miami, USA',
    yearsOfExperience: 15,
    rating: 4.7,
    reviews: 32,
    specialties: ['Coastal', 'Luxury', 'Residential'],
  },
  {
    id: 'a5',
    name: 'Yuki Tanaka',
    avatarUrl: 'https://randomuser.me/api/portraits/women/22.jpg',
    location: 'Seattle, USA',
    yearsOfExperience: 7,
    rating: 4.5,
    reviews: 19,
    specialties: ['Japanese', 'Minimalist', 'Garden'],
  },
  {
    id: 'a6',
    name: 'Lars Andersen',
    avatarUrl: 'https://randomuser.me/api/portraits/men/76.jpg',
    location: 'Boston, USA',
    yearsOfExperience: 10,
    rating: 4.8,
    reviews: 27,
    specialties: ['Scandinavian', 'Sustainable', 'Residential'],
  },
];

const ArchitectsListPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Connect with Architects</h1>
      
      <div className="flex flex-col gap-6 mb-10">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search architects by name, location, or specialty" 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4">
            <Select defaultValue="rating">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="experience">Most Experienced</SelectItem>
                <SelectItem value="reviews">Most Reviews</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <FilterIcon className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>
        
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-muted/30 p-4 rounded-md">
            <div className="space-y-2">
              <Label>Specialties</Label>
              <div className="grid grid-cols-2 gap-2">
                {['Residential', 'Commercial', 'Interior', 'Landscape', 'Sustainable', 'Urban', 'Renovation'].map((specialty) => (
                  <div key={specialty} className="flex items-center space-x-2">
                    <Checkbox id={`specialty-${specialty}`} />
                    <Label htmlFor={`specialty-${specialty}`} className="text-sm">{specialty}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Experience</Label>
              <div className="grid grid-cols-2 gap-2">
                {['1-5 years', '5-10 years', '10+ years'].map((exp) => (
                  <div key={exp} className="flex items-center space-x-2">
                    <Checkbox id={`exp-${exp}`} />
                    <Label htmlFor={`exp-${exp}`} className="text-sm">{exp}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Location</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="au">Australia</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="pt-4">
                <Button size="sm" className="w-full">Apply Filters</Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ARCHITECTS.map((architect) => (
          <Card key={architect.id} className="overflow-hidden">
            <CardHeader className="p-0">
              <div className="h-32 bg-gradient-to-r from-blue-100 to-indigo-100"></div>
              <div className="px-6 pb-1 -mt-12 flex justify-between items-end">
                <Avatar className="h-20 w-20 rounded-full border-4 border-background">
                  <AvatarImage src={architect.avatarUrl} alt={architect.name} />
                  <AvatarFallback>{architect.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-1 bg-background px-2 py-1 rounded-full text-sm">
                  <StarIcon className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span>{architect.rating}</span>
                  <span className="text-muted-foreground">({architect.reviews})</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-3">
              <h3 className="font-semibold text-lg">{architect.name}</h3>
              
              <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                <MapPinIcon className="h-3 w-3" />
                <span>{architect.location}</span>
              </div>
              
              <div className="mt-3 text-sm text-muted-foreground">
                <p>{architect.yearsOfExperience} years experience</p>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-3">
                {architect.specialties.map((specialty) => (
                  <span 
                    key={specialty} 
                    className="bg-muted px-2 py-1 rounded-full text-xs"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to={`/profile/${architect.id}`}>View Profile</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ArchitectsListPage;
