
import { Link, useNavigate } from 'react-router-dom';
import { MapPinIcon, BriefcaseIcon, UsersIcon, SettingsIcon, MailIcon, CalendarIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

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
              {isArchitect && profile.availableForHire && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Available for Hire
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
                <span>{profile.followers.toLocaleString()} followers</span>
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
                Settings
              </Button>
            ) : (
              <>
                <Button className="flex-1 md:flex-none" size="lg">Follow</Button>
                {isArchitect ? (
                  <Button variant="secondary" className="flex-1 md:flex-none" size="lg" asChild>
                    <Link to={`/hire/${profile.id}`}>
                      Hire Now
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
