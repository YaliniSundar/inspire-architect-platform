
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HomeIcon, BuildingIcon, CompassIcon, SparklesIcon } from 'lucide-react';
import DesignCard, { DesignProps } from '@/components/DesignCard';

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
];

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 md:py-32 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-design-dark/90 to-design-blue/80 z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1487958449943-2429e8be8625" 
            alt="Architectural building" 
            className="w-full h-full object-cover object-center"
          />
        </div>
        
        <div className="container relative z-20">
          <div className="max-w-2xl animate-fade-in">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Discover & Connect with Top Architectural Designs
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              Find inspiration for your dream home or showcase your architectural expertise
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link to="/explore">Explore Designs</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20" asChild>
                <Link to="/ai-generator">Try AI Generator</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            How Design Next Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background rounded-lg p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CompassIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Discover Designs</h3>
              <p className="text-muted-foreground">Browse thousands of architectural designs to find inspiration for your dream home.</p>
            </div>
            
            <div className="bg-background rounded-lg p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BuildingIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Connect with Architects</h3>
              <p className="text-muted-foreground">Find and hire professional architects to bring your vision to life.</p>
            </div>
            
            <div className="bg-background rounded-lg p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <SparklesIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">AI Generation</h3>
              <p className="text-muted-foreground">Generate architectural concept designs from your text descriptions using AI.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Designs */}
      <section className="py-16">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Trending Designs</h2>
            <Link to="/explore">
              <Button variant="outline">View All</Button>
            </Link>
          </div>

          <Tabs defaultValue="all" className="mb-8">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="modern">Modern</TabsTrigger>
              <TabsTrigger value="minimalist">Minimalist</TabsTrigger>
              <TabsTrigger value="sustainable">Sustainable</TabsTrigger>
              <TabsTrigger value="traditional">Traditional</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_DESIGNS.map((design) => (
              <DesignCard key={design.id} design={design} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-design-accent/5">
        <div className="container">
          <div className="bg-background rounded-xl p-8 text-center shadow-sm max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Are you an architect?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Showcase your portfolio, connect with potential clients, and grow your architectural practice.
            </p>
            <Button size="lg">Join as an Architect</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
