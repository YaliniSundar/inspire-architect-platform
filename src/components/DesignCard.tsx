
import { Link } from 'react-router-dom';
import { HeartIcon, BookmarkIcon, MessageSquareIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/contexts/AuthContext';

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
  compact?: boolean; // Added compact prop
}

const DesignCard = ({ design, compact = false }: DesignCardProps) => {
  const { user, saveItem, likeItem, removeSavedItem, removeLikedItem } = useAuth();
  
  // Check if the user has liked/saved this item
  const isLiked = user?.likedItems?.includes(design.id) || false;
  const isSaved = user?.savedItems?.includes(design.id) || false;
  
  // Handle like/unlike
  const handleLike = async () => {
    if (isLiked) {
      await removeLikedItem(design.id);
    } else {
      await likeItem(design.id);
    }
  };
  
  // Handle save/unsave
  const handleSave = async () => {
    if (isSaved) {
      await removeSavedItem(design.id);
    } else {
      await saveItem(design.id);
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
              {design.likes}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`text-xs flex items-center gap-1 ${isSaved ? 'text-blue-500' : ''}`}
              onClick={handleSave}
            >
              <BookmarkIcon className="h-3.5 w-3.5" fill={isSaved ? "currentColor" : "none"} />
              {design.saves}
            </Button>
            <Button variant="ghost" size="sm" className="text-xs flex items-center gap-1">
              <MessageSquareIcon className="h-3.5 w-3.5" />
              {design.comments}
            </Button>
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
