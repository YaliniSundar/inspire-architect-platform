
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MapPinIcon, BriefcaseIcon, CalendarIcon, HeartIcon, UsersIcon, MailIcon, SettingsIcon, FolderIcon, ChevronDownIcon, BookmarkIcon } from 'lucide-react';
import DesignCard, { DesignProps } from '@/components/DesignCard';
import { useAuth } from '@/contexts/AuthContext';

// Mock profiles data - would come from an API in a real app
const MOCK_PROFILES = {
  'a1': {
    id: 'a1',
    name: 'Sarah Johnson',
    avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    coverUrl: 'https://images.unsplash.com/photo-1497604401993-f2e922e5cb0a',
    role: 'Architect & Interior Designer',
    location: 'Los Angeles, CA',
    yearsOfExperience: 8,
    followers: 1243,
    following: 156,
    about: 'Award-winning architect specializing in modern residential designs with a focus on sustainability and innovative use of space. My approach combines functionality with aesthetic beauty to create homes that reflect the unique personalities of my clients.',
    education: [
      { degree: 'Master of Architecture', institution: 'University of California, Los Angeles', year: '2015' },
      { degree: 'Bachelor of Arts in Design', institution: 'Rhode Island School of Design', year: '2012' }
    ],
    specialties: ['Modern', 'Minimalist', 'Sustainable', 'Residential'],
    awards: [
      { name: 'AIA Residential Design Award', year: '2021' },
      { name: 'Green Building Excellence Award', year: '2019' }
    ],
    contact: {
      email: 'sarah.johnson@designnext.com',
      website: 'www.sarahjohnsonarchitect.com'
    }
  },
  'a2': {
    id: 'a2',
    name: 'Michael Chen',
    avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    coverUrl: 'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e',
    role: 'Architectural Designer',
    location: 'New York, NY',
    yearsOfExperience: 12,
    followers: 2150,
    following: 284,
    about: 'Urban design specialist with a passion for adaptive reuse and industrial spaces. I transform forgotten buildings into vibrant, functional environments that honor their history while embracing modern needs.',
    education: [
      { degree: 'Master of Architecture', institution: 'Columbia University', year: '2011' },
      { degree: 'Bachelor of Engineering', institution: 'Cornell University', year: '2008' }
    ],
    specialties: ['Industrial', 'Urban', 'Renovation', 'Commercial'],
    awards: [
      { name: 'Urban Renewal Excellence Award', year: '2022' },
      { name: 'Historic Preservation Honor', year: '2020' }
    ],
    contact: {
      email: 'michael.chen@designnext.com',
      website: 'www.michaelchendesign.com'
    }
  },
};

// Mock designs for the profile
const MOCK_PROFILE_DESIGNS: Record<string, DesignProps[]> = {
  'a1': [
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
      id: '4',
      title: 'Coastal Retreat',
      imageUrl: 'https://images.unsplash.com/photo-1439337153520-7082a56a81f4',
      architect: {
        id: 'a1',
        name: 'Sarah Johnson',
        avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
      },
      tags: ['Coastal', 'Beach House', 'Vacation'],
      likes: 276,
      saves: 98,
      comments: 36,
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
  ],
  'a2': [
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
  ],
};

// All designs for browsing/collections
const ALL_DESIGNS: DesignProps[] = [
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
    title: 'Scandinavian Inspired Home',
    imageUrl: 'https://images.unsplash.com/photo-1463797221720-6b07e6426c24',
    architect: {
      id: 'a3',
      name: 'Emma Nielsen',
      avatarUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
    },
    tags: ['Scandinavian', 'Minimal', 'Cozy'],
    likes: 312,
    saves: 145,
    comments: 47,
  },
  {
    id: '4',
    title: 'Coastal Retreat',
    imageUrl: 'https://images.unsplash.com/photo-1439337153520-7082a56a81f4',
    architect: {
      id: 'a1',
      name: 'Sarah Johnson',
      avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
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
    title: 'Industrial Warehouse Conversion',
    imageUrl: 'https://images.unsplash.com/photo-1459535653751-d571815e906b',
    architect: {
      id: 'a4',
      name: 'James Wilson',
      avatarUrl: 'https://randomuser.me/api/portraits/men/79.jpg',
    },
    tags: ['Industrial', 'Warehouse', 'Conversion'],
    likes: 289,
    saves: 112,
    comments: 41,
  },
  {
    id: '7',
    title: 'Zen Garden House',
    imageUrl: 'https://images.unsplash.com/photo-1484154218962-a197022b5858',
    architect: {
      id: 'a5',
      name: 'Yuki Tanaka',
      avatarUrl: 'https://randomuser.me/api/portraits/women/58.jpg',
    },
    tags: ['Japanese', 'Zen', 'Garden'],
    likes: 354,
    saves: 187,
    comments: 63,
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

// Collection folders for categorizing saved/liked items
const COLLECTION_FOLDERS = [
  { id: 'modern', name: 'Modern Designs', icon: <FolderIcon className="h-4 w-4" /> },
  { id: 'coastal', name: 'Coastal Inspiration', icon: <FolderIcon className="h-4 w-4" /> },
  { id: 'sustainable', name: 'Sustainable Ideas', icon: <FolderIcon className="h-4 w-4" /> },
];

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const { user, saveItem, likeItem } = useAuth();
  const navigate = useNavigate();
  
  const profile = MOCK_PROFILES[id as keyof typeof MOCK_PROFILES];
  const profileDesigns = MOCK_PROFILE_DESIGNS[id as keyof typeof MOCK_PROFILE_DESIGNS] || [];
  
  // Check if viewing own profile
  const isOwnProfile = user?.id === id;
  
  // Filter saved and liked items based on user collections
  const savedItems = user?.savedItems 
    ? ALL_DESIGNS.filter(design => user.savedItems?.includes(design.id))
    : [];
  
  const likedItems = user?.likedItems
    ? ALL_DESIGNS.filter(design => user.likedItems?.includes(design.id))
    : [];
  
  if (!profile) {
    return (
      <div className="container py-16 text-center">
        <h2 className="text-2xl font-medium mb-2">Profile not found</h2>
        <p className="text-muted-foreground mb-6">The profile you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/explore">Back to Explore</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div>
      {/* Cover Image */}
      <div className="relative h-64 md:h-80 w-full">
        <img
          src={profile.coverUrl}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
      </div>
      
      <div className="container relative">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-20 mb-8">
          <Avatar className="w-32 h-32 border-4 border-background">
            <AvatarImage src={profile.avatarUrl} alt={profile.name} />
            <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-2">
            <h1 className="text-3xl font-bold">{profile.name}</h1>
            <p className="text-muted-foreground">{profile.role}</p>
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPinIcon className="h-4 w-4" />
                <span>{profile.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <BriefcaseIcon className="h-4 w-4" />
                <span>{profile.yearsOfExperience} years experience</span>
              </div>
              <div className="flex items-center gap-1">
                <UsersIcon className="h-4 w-4" />
                <span>{profile.followers.toLocaleString()} followers</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 self-stretch md:self-auto">
            {isOwnProfile ? (
              <Button className="flex items-center gap-2" variant="outline" size="lg" onClick={() => navigate('/settings')}>
                <SettingsIcon className="h-4 w-4" />
                Settings
              </Button>
            ) : (
              <>
                <Button className="flex-1 md:flex-none" size="lg">Follow</Button>
                <Button variant="outline" className="flex-1 md:flex-none" size="lg">
                  <MailIcon className="h-4 w-4 mr-2" />
                  Message
                </Button>
              </>
            )}
          </div>
        </div>
        
        {/* Profile Tabs & Content */}
        <Tabs defaultValue={isOwnProfile ? "collections" : "designs"} className="mb-12">
          <TabsList className="mb-6">
            <TabsTrigger value="designs">Designs</TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="designs">
            <div className="space-y-6">
              {profile.id === user?.id && user?.userType === 'architect' && (
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-medium">My Designs</h2>
                  <Button>Upload New Design</Button>
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {profileDesigns.map((design) => (
                  <DesignCard key={design.id} design={design} />
                ))}
              </div>
              
              {profileDesigns.length === 0 && (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">No designs yet</h3>
                  <p className="text-muted-foreground">This architect hasn't uploaded any designs yet.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="collections">
            <div className="space-y-8">
              {/* Saved Items */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-medium flex items-center gap-2">
                    <BookmarkIcon className="h-5 w-5" />
                    Saved Items
                  </h2>
                </div>
                
                {COLLECTION_FOLDERS.map((folder) => (
                  <Collapsible key={folder.id} className="border rounded-lg">
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left font-medium">
                      <div className="flex items-center gap-2">
                        {folder.icon}
                        <span>{folder.name}</span>
                        <Badge variant="secondary" className="ml-2">
                          {savedItems.filter(item => item.tags.some(tag => 
                            tag.toLowerCase().includes(folder.id.toLowerCase())
                          )).length}
                        </Badge>
                      </div>
                      <ChevronDownIcon className="h-5 w-5 transition-transform ui-open:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-4 pb-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {savedItems
                          .filter(item => item.tags.some(tag => 
                            tag.toLowerCase().includes(folder.id.toLowerCase())
                          ))
                          .map((design) => (
                            <DesignCard key={design.id} design={design} compact />
                          ))}
                      </div>
                      {savedItems.filter(item => item.tags.some(tag => 
                        tag.toLowerCase().includes(folder.id.toLowerCase())
                      )).length === 0 && (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No saved items in this folder</p>
                        </div>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                ))}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {savedItems
                    .filter(item => !COLLECTION_FOLDERS.some(folder => 
                      item.tags.some(tag => tag.toLowerCase().includes(folder.id.toLowerCase()))
                    ))
                    .map((design) => (
                      <DesignCard key={design.id} design={design} />
                    ))}
                </div>
                
                {savedItems.length === 0 && (
                  <div className="text-center py-12 bg-muted/30 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">No saved items yet</h3>
                    <p className="text-muted-foreground">You haven't saved any designs yet.</p>
                    <Button asChild className="mt-4">
                      <Link to="/explore">Explore Designs</Link>
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Liked Items */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-medium flex items-center gap-2">
                    <HeartIcon className="h-5 w-5" />
                    Liked Items
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {likedItems.map((design) => (
                    <DesignCard key={design.id} design={design} />
                  ))}
                </div>
                
                {likedItems.length === 0 && (
                  <div className="text-center py-12 bg-muted/30 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">No liked items yet</h3>
                    <p className="text-muted-foreground">You haven't liked any designs yet.</p>
                    <Button asChild className="mt-4">
                      <Link to="/explore">Explore Designs</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="about">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* About Bio */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h2 className="text-xl font-medium mb-4">About</h2>
                  <p className="text-muted-foreground">{profile.about}</p>
                </div>
                
                <div>
                  <h2 className="text-xl font-medium mb-4">Education</h2>
                  <div className="space-y-4">
                    {profile.education.map((edu, index) => (
                      <div key={index} className="flex gap-3">
                        <CalendarIcon className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-medium">{edu.degree}</h3>
                          <p className="text-sm text-muted-foreground">{edu.institution}, {edu.year}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-medium mb-4">Awards & Recognitions</h2>
                  <div className="space-y-4">
                    {profile.awards.map((award, index) => (
                      <div key={index} className="flex gap-3">
                        <HeartIcon className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-medium">{award.name}</h3>
                          <p className="text-sm text-muted-foreground">{award.year}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Sidebar info */}
              <div className="space-y-6">
                <div className="bg-muted/30 rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4">Specializations</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary">{specialty}</Badge>
                    ))}
                  </div>
                </div>
                
                <div className="bg-muted/30 rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Email</p>
                      <p className="font-medium">{profile.contact.email}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Website</p>
                      <p className="font-medium">{profile.contact.website}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-background border rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4">Hire for a Project</h3>
                  <p className="text-sm text-muted-foreground mb-4">Interested in working with {profile.name.split(' ')[0]}? Get in touch to discuss your project.</p>
                  <Button className="w-full">Start a Project</Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews">
            <div className="space-y-8">
              <div className="bg-muted/30 rounded-lg p-6 text-center">
                <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
                <p className="text-muted-foreground">This architect hasn't received any reviews yet.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
