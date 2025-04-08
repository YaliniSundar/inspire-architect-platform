
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
      <ProfileHeader profile={profile} isOwnProfile={isOwnProfile} />
      
      {/* Profile Tabs & Content */}
      <div className="container">
        <Tabs defaultValue={isOwnProfile ? "collections" : "designs"} className="mb-12">
          <TabsList className="mb-6">
            <TabsTrigger value="designs">Designs</TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="designs">
            <DesignsTab 
              profileId={profile.id} 
              isOwnProfile={isOwnProfile} 
              userType={user?.userType} 
              designs={profileDesigns} 
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
          
          <TabsContent value="reviews">
            <ReviewsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
