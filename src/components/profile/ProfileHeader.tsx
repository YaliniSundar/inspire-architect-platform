
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPinIcon, BriefcaseIcon, UsersIcon, SettingsIcon, MailIcon, CalendarIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/contexts/AuthContext';
import { followArchitect, unfollowArchitect, getHiringStatus } from '@/services/supabaseService';
import { toast } from '@/components/ui/use-toast';

interface ProfileHeaderProps {
  profile: {
    id: string;
    name: string;
    avatarUrl: string;
    coverUrl: string;
    role: string;
    location: string;
    yearsOfExperience: number;
    followers: number;
    availableForHire?: boolean;
    specialties?: string[];
  };
  isOwnProfile: boolean;
  isArchitect?: boolean;
}

const ProfileHeader = ({ profile, isOwnProfile, isArchitect = false }: ProfileHeaderProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isHired, setIsHired] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [followersCount, setFollowersCount] = useState(profile.followers);
  
  useEffect(() => {
    // Check if user is already following this profile
    const checkFollowStatus = async () => {
      if (!user || !profile.id) return;
      
      try {
        // In a real app, this would check the database for follow status
        // For now we'll simulate with local storage
        const followingList = JSON.parse(localStorage.getItem(`following_${user.id}`) || '[]');
        setIsFollowing(followingList.includes(profile.id));
        
        // Also check if the architect has been hired by this user
        if (isArchitect && user.userType === 'homeowner') {
          const { status } = await getHiringStatus(user.id, profile.id);
          setIsHired(status === 'accepted' || status === 'pending');
        }
      } catch (error) {
        console.error("Error checking follow status:", error);
      }
    };
    
    checkFollowStatus();
  }, [user, profile.id, isArchitect]);
  
  const handleFollowToggle = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to follow this profile",
        variant: "destructive",
      });
      return navigate('/login');
    }
    
    setLoadingFollow(true);
    
    try {
      if (isFollowing) {
        await unfollowArchitect(user.id, profile.id);
        
        // Update local state
        const followingList = JSON.parse(localStorage.getItem(`following_${user.id}`) || '[]');
        localStorage.setItem(`following_${user.id}`, JSON.stringify(
          followingList.filter((id: string) => id !== profile.id)
        ));
        
        setIsFollowing(false);
        setFollowersCount(prev => prev - 1);
        
        toast({
          title: "Unfollowed",
          description: `You are no longer following ${profile.name}`,
        });
      } else {
        await followArchitect(user.id, profile.id);
        
        // Update local state
        const followingList = JSON.parse(localStorage.getItem(`following_${user.id}`) || '[]');
        followingList.push(profile.id);
        localStorage.setItem(`following_${user.id}`, JSON.stringify(followingList));
        
        setIsFollowing(true);
        setFollowersCount(prev => prev + 1);
        
        toast({
          title: "Following",
          description: `You are now following ${profile.name}`,
        });
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast({
        title: "Action failed",
        description: "Could not update follow status",
        variant: "destructive",
      });
    } finally {
      setLoadingFollow(false);
    }
  };
  
  return (
    <>
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
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold">{profile.name}</h1>
              {isArchitect && profile.availableForHire && !isHired && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Available for Hire
                </Badge>
              )}
              {isArchitect && isHired && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Hired
                </Badge>
              )}
            </div>
            
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
                <span>{followersCount.toLocaleString()} followers</span>
              </div>
              <div className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                <span>Member since 2023</span>
              </div>
            </div>

            {/* Show specialties for architects */}
            {isArchitect && profile.specialties && profile.specialties.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {profile.specialties.slice(0, 3).map((specialty, index) => (
                  <Badge key={index} variant="outline">{specialty}</Badge>
                ))}
                {profile.specialties.length > 3 && (
                  <Badge variant="outline">+{profile.specialties.length - 3} more</Badge>
                )}
              </div>
            )}
          </div>
          
          <div className="flex gap-2 self-stretch md:self-auto">
            {isOwnProfile ? (
              <Button className="flex items-center gap-2" variant="outline" size="lg" onClick={() => navigate('/settings')}>
                <SettingsIcon className="h-4 w-4" />
                Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  className={`flex-1 md:flex-none ${isFollowing ? 'bg-secondary hover:bg-secondary/90 text-secondary-foreground' : ''}`}
                  size="lg"
                  variant={isFollowing ? "outline" : "default"}
                  onClick={handleFollowToggle}
                  disabled={loadingFollow}
                >
                  {isFollowing ? (
                    <>
                      <span className="flex items-center">
                        <span className="mr-1">✓</span> Following
                      </span>
                    </>
                  ) : "Follow"}
                </Button>
                
                {isArchitect ? (
                  <Button 
                    variant="secondary" 
                    className="flex-1 md:flex-none" 
                    size="lg" 
                    asChild
                    disabled={isHired}
                  >
                    <Link to={`/hire/${profile.id}`}>
                      {isHired ? "Already Hired" : "Hire Now"}
                    </Link>
                  </Button>
                ) : (
                  <Button variant="outline" className="flex-1 md:flex-none" size="lg">
                    <MailIcon className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileHeader;
