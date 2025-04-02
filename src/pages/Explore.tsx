
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SlidersIcon, FilterIcon, XIcon } from 'lucide-react';
import DesignCard, { DesignProps } from '@/components/DesignCard';

// Mock data - would come from an API in a real app
const MOCK_DESIGNS: DesignProps[] = [
  {
    id: '1',
    title: 'Modern Minimalist Villa',
    imageUrl: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742',
    architect: {
      id: 'a1',
      name: 'Sarah Johnson',
      avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    tags: ['Modern', 'Minimalist', 'Villa'],
    likes: 245,
    saves: 89,
    comments: 32,
  },
  {
    id: '2',
    title: 'Urban Loft Renovation',
    imageUrl: 'https://images.unsplash.com/photo-1492321936769-b49830bc1d1e',
    architect: {
      id: 'a2',
      name: 'Michael Chen',
      avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    tags: ['Industrial', 'Loft', 'Renovation'],
    likes: 189,
    saves: 67,
    comments: 21,
  },
  {
    id: '3',
    title: 'Sustainable Family Home',
    imageUrl: 'https://images.unsplash.com/photo-1496307653780-42ee777d4833',
    architect: {
      id: 'a3',
      name: 'Emma Rodriguez',
      avatarUrl: 'https://randomuser.me/api/portraits/women/63.jpg',
    },
    tags: ['Sustainable', 'Family', 'Eco-friendly'],
    likes: 312,
    saves: 124,
    comments: 45,
  },
  {
    id: '4',
    title: 'Coastal Retreat',
    imageUrl: 'https://images.unsplash.com/photo-1439337153520-7082a56a81f4',
    architect: {
      id: 'a4',
      name: 'David Thompson',
      avatarUrl: 'https://randomuser.me/api/portraits/men/52.jpg',
    },
    tags: ['Coastal', 'Beach House', 'Vacation'],
    likes: 276,
    saves: 98,
    comments: 36,
  },
  {
    id: '5',
    title: 'Contemporary City Apartment',
    imageUrl: 'https://images.unsplash.com/photo-1481277542470-605612bd2d61',
    architect: {
      id: 'a2',
      name: 'Michael Chen',
      avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    tags: ['Contemporary', 'Apartment', 'City'],
    likes: 198,
    saves: 53,
    comments: 18,
  },
  {
    id: '6',
    title: 'Japanese-Inspired Garden House',
    imageUrl: 'https://images.unsplash.com/photo-1605146769289-440113cc3d00',
    architect: {
      id: 'a5',
      name: 'Yuki Tanaka',
      avatarUrl: 'https://randomuser.me/api/portraits/women/22.jpg',
    },
    tags: ['Japanese', 'Garden', 'Zen'],
    likes: 367,
    saves: 142,
    comments: 51,
  },
  {
    id: '7',
    title: 'Scandinavian Wooden Cabin',
    imageUrl: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da',
    architect: {
      id: 'a6',
      name: 'Lars Andersen',
      avatarUrl: 'https://randomuser.me/api/portraits/men/76.jpg',
    },
    tags: ['Scandinavian', 'Cabin', 'Wooden'],
    likes: 289,
    saves: 104,
    comments: 37,
  },
  {
    id: '8',
    title: 'Glass House by the Lake',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
    architect: {
      id: 'a1',
      name: 'Sarah Johnson',
      avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    tags: ['Glass', 'Lake', 'Modern'],
    likes: 421,
    saves: 167,
    comments: 59,
  },
];

// FilterPanel Component
const FilterPanel = ({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean, 
  onClose: () => void 
}) => {
  return (
    <div className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} w-80 bg-background border-r z-40 overflow-y-auto transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:block md:w-64`}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Filters</h3>
          <Button variant="ghost" size="sm" onClick={onClose} className="md:hidden">
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Style</Label>
            <div className="grid grid-cols-2 gap-2">
              {['Modern', 'Minimalist', 'Traditional', 'Industrial', 'Coastal', 'Farmhouse', 'Contemporary', 'Scandinavian'].map((style) => (
                <div key={style} className="flex items-center space-x-2">
                  <Checkbox id={`style-${style}`} />
                  <Label htmlFor={`style-${style}`} className="text-sm">{style}</Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Property Type</Label>
            <div className="grid grid-cols-1 gap-2">
              {['House', 'Apartment', 'Villa', 'Cabin', 'Loft', 'Studio'].map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox id={`type-${type}`} />
                  <Label htmlFor={`type-${type}`} className="text-sm">{type}</Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Size (sqft)</Label>
            <Slider defaultValue={[1000, 3000]} min={0} max={5000} step={100} />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0</span>
              <span>5000+</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Budget Range</Label>
            <Select defaultValue="any">
              <SelectTrigger>
                <SelectValue placeholder="Any budget" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any budget</SelectItem>
                <SelectItem value="low">$0 - $100,000</SelectItem>
                <SelectItem value="medium">$100,000 - $500,000</SelectItem>
                <SelectItem value="high">$500,000 - $1,000,000</SelectItem>
                <SelectItem value="luxury">$1,000,000+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="pt-4">
            <Button className="w-full">Apply Filters</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Explore = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filter sidebar for desktop */}
        <FilterPanel isOpen={filterOpen} onClose={() => setFilterOpen(false)} />
        
        {/* Mobile filter button */}
        <Button 
          variant="outline" 
          size="sm" 
          className="md:hidden flex items-center gap-2 mb-4 self-start"
          onClick={() => setFilterOpen(true)}
        >
          <FilterIcon className="h-4 w-4" />
          Filters
        </Button>
        
        {/* Main content area */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">Explore Designs</h1>
            
            <div className="flex items-center gap-2 self-stretch sm:self-auto">
              <Select defaultValue="popular">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="trending">Trending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_DESIGNS.map((design) => (
              <DesignCard key={design.id} design={design} />
            ))}
          </div>
          
          <div className="mt-12 flex justify-center">
            <Button variant="outline">Load More</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
