
import { Link } from 'react-router-dom';
import { HeartIcon, BookmarkIcon, MessageSquareIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { likePost, unlikePost, savePost, unsavePost } from '@/services/supabaseService';
import { toast } from '@/components/ui/use-toast';

export interface DesignProps {
  id: string;
  title: string;
  imageUrl: string;
  architect: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  tags: string[];
  likes: number;
  saves: number;
  comments: number;
}

interface DesignCardProps {
  design: DesignProps;
  compact?: boolean;
}

const DesignCard = ({ design, compact = false }: DesignCardProps) => {
  const { user } = useAuth();
  
  // Use local state to track like/save status for immediate UI feedback
  const [isLiked, setIsLiked] = useState(user?.likedItems?.includes(design.id) || false);
  const [isSaved, setIsSaved] = useState(user?.savedItems?.includes(design.id) || false);
  const [likesCount, setLikesCount] = useState(design.likes);
  const [savesCount, setSavesCount] = useState(design.saves);
  
  // Handle like/unlike
  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to design detail
    
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to like designs",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (isLiked) {
        await unlikePost(user.id, design.id);
        setLikesCount(prev => prev - 1);
      } else {
        await likePost(user.id, design.id);
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
  
  // Handle save/unsave
  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to design detail
    
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to save designs",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (isSaved) {
        await unsavePost(user.id, design.id);
        setSavesCount(prev => prev - 1);
      } else {
        await savePost(user.id, design.id);
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

  return (
    <div className={`group relative bg-background rounded-lg border overflow-hidden ${compact ? 'h-40' : ''}`}>
      {/* Card Image */}
      <div className={`relative ${compact ? 'h-full' : 'h-48 sm:h-64'}`}>
        <img
          src={design.imageUrl}
          alt={design.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Hover Actions */}
        <div className="absolute bottom-0 w-full p-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Link to={`/design/${design.id}`} className="w-full">
            <Button variant="secondary" className="w-full">View Details</Button>
          </Link>
        </div>
      </div>
      
      {/* Card Content */}
      {!compact && (
        <div className="p-4 space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="font-medium truncate">
              <Link to={`/design/${design.id}`} className="hover:underline">
                {design.title}
              </Link>
            </h3>
          </div>
          
          <Link to={`/profile/${design.architect.id}`} className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full overflow-hidden">
              <img 
                src={design.architect.avatarUrl} 
                alt={design.architect.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm text-muted-foreground">{design.architect.name}</span>
          </Link>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {design.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          
          {/* Interactions */}
          <div className="flex justify-between pt-2 border-t">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`text-xs flex items-center gap-1 ${isLiked ? 'text-red-500' : ''}`}
              onClick={handleLike}
            >
              <HeartIcon className="h-3.5 w-3.5" fill={isLiked ? "currentColor" : "none"} />
              {likesCount}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`text-xs flex items-center gap-1 ${isSaved ? 'text-blue-500' : ''}`}
              onClick={handleSave}
            >
              <BookmarkIcon className="h-3.5 w-3.5" fill={isSaved ? "currentColor" : "none"} />
              {savesCount}
            </Button>
            <Link to={`/design/${design.id}`} className="w-full">
              <Button variant="ghost" size="sm" className="text-xs flex items-center gap-1">
                Details
              </Button>
            </Link>
          </div>
        </div>
      )}
      
      {/* Compact mode title overlay */}
      {compact && (
        <div className="absolute bottom-0 w-full p-2 bg-gradient-to-t from-black/80 to-transparent">
          <h3 className="text-sm font-medium text-white truncate">{design.title}</h3>
          {design.tags.length > 0 && (
            <Badge variant="secondary" className="text-xs mt-1">
              {design.tags[0]}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default DesignCard;
