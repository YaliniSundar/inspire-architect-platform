
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeartIcon, BookmarkIcon, MessageSquareIcon } from 'lucide-react';

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

const DesignCard = ({ design }: { design: DesignProps }) => {
  return (
    <Card className="design-card overflow-hidden">
      <Link to={`/design/${design.id}`}>
        <div className="relative overflow-hidden aspect-[4/3]">
          <img 
            src={design.imageUrl} 
            alt={design.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </Link>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <Link to={`/design/${design.id}`}>
              <h3 className="font-medium text-lg line-clamp-1 hover:text-primary transition-colors">
                {design.title}
              </h3>
            </Link>
            <Link to={`/profile/${design.architect.id}`} className="flex items-center gap-2 mt-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={design.architect.avatarUrl} alt={design.architect.name} />
                <AvatarFallback>{design.architect.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">{design.architect.name}</span>
            </Link>
          </div>
          
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <BookmarkIcon className="h-4 w-4" />
            <span className="sr-only">Save</span>
          </Button>
        </div>

        <div className="flex flex-wrap gap-1 mt-3">
          {design.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">{tag}</Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between items-center border-t mt-2">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="flex items-center gap-1 h-8 px-2">
            <HeartIcon className="h-4 w-4" />
            <span className="text-xs">{design.likes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1 h-8 px-2">
            <MessageSquareIcon className="h-4 w-4" />
            <span className="text-xs">{design.comments}</span>
          </Button>
        </div>
        <Link to={`/design/${design.id}`}>
          <Button variant="outline" size="sm">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default DesignCard;
