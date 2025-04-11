
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { HeartIcon, BookmarkIcon, ShareIcon, HomeIcon } from 'lucide-react';
import { DesignProps } from '@/components/DesignCard';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { likePost, unlikePost, savePost, unsavePost } from '@/services/supabaseService';
import { toast } from '@/components/ui/use-toast';

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
];

// Additional mock details
const MOCK_DETAILS = {
  '1': {
    description: 'A sleek modern villa designed with minimalist principles. This home features open spaces, clean lines, and a harmonious connection to the surrounding landscape. The design prioritizes natural light and sustainable materials.',
    size: '4,200 sq ft',
    bedrooms: 4,
    bathrooms: 3.5,
    location: 'Los Angeles, CA',
    completionYear: 2022,
    budget: '$1.2 million',
    additionalImages: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0',
      'https://images.unsplash.com/photo-1580237541049-2d715a09486e',
    ],
  },
  '2': {
    description: 'An urban loft renovation that transforms an industrial space into a modern living area while preserving the original character. Features exposed brick walls, high ceilings, and an open floor plan that maximizes space and light.',
    size: '1,800 sq ft',
    bedrooms: 2,
    bathrooms: 2,
    location: 'New York, NY',
    completionYear: 2021,
    budget: '$950,000',
    additionalImages: [
      'https://images.unsplash.com/photo-1574691530758-0a479e52a722',
      'https://images.unsplash.com/photo-1633505899118-4ca6bd143042',
      'https://images.unsplash.com/photo-1617806118233-18e1de247200',
    ],
  },
};

const DesignDetail = () => {
  const { id } = useParams<{ id: string }>();
  const design = MOCK_DESIGNS.find(d => d.id === id);
  const details = MOCK_DETAILS[id as keyof typeof MOCK_DETAILS];
  const { user } = useAuth();
  
  // Local state for like/save status
  const [isLiked, setIsLiked] = useState(user?.likedItems?.includes(id || '') || false);
  const [isSaved, setIsSaved] = useState(user?.savedItems?.includes(id || '') || false);
  const [likesCount, setLikesCount] = useState(design?.likes || 0);
  const [savesCount, setSavesCount] = useState(design?.saves || 0);
  
  const handleLikeToggle = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to like this design",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (isLiked) {
        await unlikePost(user.id, id || '');
        setLikesCount(prev => prev - 1);
      } else {
        await likePost(user.id, id || '');
        setLikesCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error toggling like:", error);
      toast({
        title: "Action failed",
        description: "Could not update like status",
        variant: "destructive",
      });
    }
  };
  
  const handleSaveToggle = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to save this design",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (isSaved) {
        await unsavePost(user.id, id || '');
        setSavesCount(prev => prev - 1);
      } else {
        await savePost(user.id, id || '');
        setSavesCount(prev => prev + 1);
      }
      setIsSaved(!isSaved);
    } catch (error) {
      console.error("Error toggling save:", error);
      toast({
        title: "Action failed",
        description: "Could not update save status",
        variant: "destructive",
      });
    }
  };
  
  if (!design || !details) {
    return (
      <div className="container py-16 text-center">
        <h2 className="text-2xl font-medium mb-2">Design not found</h2>
        <p className="text-muted-foreground mb-6">The design you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/explore">Back to Explore</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-foreground">
              <HomeIcon className="h-3 w-3" />
              <span className="sr-only">Home</span>
            </Link>
            <span>/</span>
            <Link to="/explore" className="hover:text-foreground">Explore</Link>
            <span>/</span>
            <span className="text-foreground truncate max-w-[200px]">{design.title}</span>
          </div>
          
          {/* Main content */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">{design.title}</h1>
            
            <div className="flex justify-between items-center">
              <Link to={`/profile/${design.architect.id}`} className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={design.architect.avatarUrl} alt={design.architect.name} />
                  <AvatarFallback>{design.architect.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{design.architect.name}</p>
                  <p className="text-sm text-muted-foreground">Architect</p>
                </div>
              </Link>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`flex items-center gap-1 ${isLiked ? 'bg-rose-100 text-rose-500 border-rose-200 hover:bg-rose-200 hover:text-rose-600' : ''}`}
                  onClick={handleLikeToggle}
                >
                  <HeartIcon className="h-4 w-4" fill={isLiked ? "currentColor" : "none"} />
                  <span>{likesCount}</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`flex items-center gap-1 ${isSaved ? 'bg-blue-100 text-blue-500 border-blue-200 hover:bg-blue-200 hover:text-blue-600' : ''}`}
                  onClick={handleSaveToggle}
                >
                  <BookmarkIcon className="h-4 w-4" fill={isSaved ? "currentColor" : "none"} />
                  <span>{savesCount}</span>
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <ShareIcon className="h-4 w-4" />
                  <span>Share</span>
                </Button>
              </div>
            </div>
            
            {/* Main image */}
            <div className="rounded-lg overflow-hidden border">
              <img
                src={design.imageUrl}
                alt={design.title}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Description */}
            <div className="bg-muted/30 rounded-lg p-6">
              <h2 className="text-xl font-medium mb-3">About this design</h2>
              <p className="text-muted-foreground">{details.description}</p>
            </div>
            
            {/* Specifications */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Size</p>
                <p className="font-medium">{details.size}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Bedrooms</p>
                <p className="font-medium">{details.bedrooms}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Bathrooms</p>
                <p className="font-medium">{details.bathrooms}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{details.location}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Year Completed</p>
                <p className="font-medium">{details.completionYear}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Budget</p>
                <p className="font-medium">{details.budget}</p>
              </div>
            </div>
            
            {/* Tags */}
            <div>
              <h3 className="text-lg font-medium mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {design.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>
            
            {/* Additional images */}
            <div>
              <h3 className="text-lg font-medium mb-3">More images</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {details.additionalImages.map((img, index) => (
                  <div key={index} className="rounded-lg overflow-hidden border aspect-[4/3]">
                    <img
                      src={img}
                      alt={`${design.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          <div className="bg-background rounded-lg border p-6 sticky top-20">
            <h3 className="text-lg font-medium mb-4">Contact Architect</h3>
            <p className="text-sm text-muted-foreground mb-6">Like this design? Reach out to the architect to discuss your project.</p>
            
            <div className="space-y-4">
              <Button className="w-full">Message Architect</Button>
              <Button variant="outline" className="w-full" asChild>
                <Link to={`/profile/${design.architect.id}`}>View Profile</Link>
              </Button>
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={handleSaveToggle}
              >
                {isSaved ? "Unsave Design" : "Save Design"}
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h4 className="text-sm font-medium mb-2">Services Offered</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                  <span>Custom Home Design</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                  <span>Renovation Consultation</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                  <span>3D Visualization</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                  <span>Interior Design</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignDetail;
