
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPinIcon, BriefcaseIcon, UsersIcon, SettingsIcon, MailIcon, CalendarIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/contexts/AuthContext';
import { followArchitect, unfollowArchitect, getHiringStatus } from '@/services/supabaseService';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { createConversation } from '@/services/chatService';

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
  const [loadingHire, setLoadingHire] = useState(false);
  const [followersCount, setFollowersCount] = useState(profile.followers);
  
  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!user || !profile.id) return;
      
      try {
        const { data } = await supabase
          .from('follows')
          .select('*')
          .eq('follower_id', user.id)
          .eq('following_id', profile.id);
          
        setIsFollowing(data && data.length > 0);
        
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
        setIsFollowing(false);
        setFollowersCount(prev => prev - 1);
        
        toast({
          title: "Unfollowed",
          description: `You are no longer following ${profile.name}`,
        });
      } else {
        await followArchitect(user.id, profile.id);
        setIsFollowing(true);
        setFollowersCount(prev => prev + 1);
        
        // Create notification for the followed user
        await supabase
          .from('notifications')
          .insert({
            user_id: profile.id,
            type: 'follow',
            content: `${user.name} started following you.`,
            related_id: user.id
          });
        
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
  
  const handleHireClick = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to hire this architect",
        variant: "destructive",
      });
      return navigate('/login');
    }
    
    if (!isFollowing) {
      toast({
        title: "Follow required",
        description: "Please follow this architect first before hiring",
        variant: "destructive",
      });
      return;
    }
    
    setLoadingHire(true);
    
    try {
      // Create conversation with the architect
      const conversation = await createConversation({
        homeownerId: user.id,
        architectId: profile.id,
        initialMessage: `Hi ${profile.name}, I'm interested in hiring you for my project.`
      });
      
      if (!conversation) throw new Error("Failed to create conversation");
      
      // Navigate to messages page with the new conversation
      navigate('/messages', { 
        state: { conversation }
      });
      
    } catch (error) {
      console.error('Error hiring architect:', error);
      toast({
        title: "Action failed",
        description: "Could not initiate hiring process",
        variant: "destructive",
      });
    } finally {
      setLoadingHire(false);
    }
  };
  
  return (
    <>
      <div className="relative h-64 md:h-80 w-full">
        <img
          src={profile.coverUrl}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
      </div>
      
      <div className="container relative">
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
                    disabled={loadingHire || !isFollowing}
                    onClick={handleHireClick}
                  >
                    {loadingHire ? "Processing..." : "Hire Now"}
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    className="flex-1 md:flex-none" 
                    size="lg"
                    onClick={() => navigate('/messages', { 
                      state: { 
                        newRecipient: {
                          id: profile.id,
                          name: profile.name,
                          avatar: profile.avatarUrl
                        }
                      }
                    })}
                  >
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
