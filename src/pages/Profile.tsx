
import { useParams, Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import ProfileHeader from '@/components/profile/ProfileHeader';
import DesignsTab from '@/components/profile/DesignsTab';
import CollectionsTab from '@/components/profile/CollectionsTab';
import AboutTab from '@/components/profile/AboutTab';
import ReviewsTab from '@/components/profile/ReviewsTab';
import { MOCK_PROFILES, MOCK_PROFILE_DESIGNS, ALL_DESIGNS } from '@/components/profile/ProfileData';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
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

  const [newDesigns, setNewDesigns] = useState(profileDesigns);
  
  // Handle adding a new design
  const handleAddDesign = (design: any) => {
    setNewDesigns(prev => [design, ...prev]);
  };

  // Determine if profile is for an architect or homeowner
  const isArchitectProfile = profile?.role?.toLowerCase().includes('architect') || false;
  
  // Select the default tab based on user type
  const getDefaultTab = () => {
    if (isOwnProfile) {
      return 'collections'; // Own profile shows collections first
    } else if (isArchitectProfile) {
      return 'designs'; // Architect profiles show designs first
    } else {
      return 'collections'; // Homeowner profiles show collections first
    }
  };
  
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
      <ProfileHeader 
        profile={profile} 
        isOwnProfile={isOwnProfile} 
        isArchitect={isArchitectProfile}
      />
      
      {/* Profile Tabs & Content */}
      <div className="container">
        <Tabs defaultValue={getDefaultTab()} className="mb-12">
          <TabsList className="mb-6">
            {isArchitectProfile && <TabsTrigger value="designs">Portfolio</TabsTrigger>}
            {!isArchitectProfile && <TabsTrigger value="designs">Designs</TabsTrigger>}
            <TabsTrigger value="collections">Collections</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            {isArchitectProfile && <TabsTrigger value="reviews">Reviews</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="designs">
            <DesignsTab 
              profileId={profile.id} 
              isOwnProfile={isOwnProfile} 
              userType={isArchitectProfile ? 'architect' : 'homeowner'} 
              designs={newDesigns} 
              onAddDesign={handleAddDesign}
            />
          </TabsContent>
          
          <TabsContent value="collections">
            <CollectionsTab 
              savedItems={savedItems} 
              likedItems={likedItems} 
            />
          </TabsContent>
          
          <TabsContent value="about">
            <AboutTab profile={profile} />
          </TabsContent>
          
          {isArchitectProfile && (
            <TabsContent value="reviews">
              <ReviewsTab 
                reviews={profile.reviews || []} 
                isArchitect={isArchitectProfile} 
                profileId={profile.id}
              />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
