
import { Link } from 'react-router-dom';
import { BookmarkIcon, HeartIcon, FolderIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import DesignCard, { DesignProps } from '@/components/DesignCard';
import CollectionFolder from './CollectionFolder';

// Collection folders for categorizing saved/liked items
const COLLECTION_FOLDERS = [
  { id: 'modern', name: 'Modern Designs', icon: <FolderIcon className="h-4 w-4" /> },
  { id: 'coastal', name: 'Coastal Inspiration', icon: <FolderIcon className="h-4 w-4" /> },
  { id: 'sustainable', name: 'Sustainable Ideas', icon: <FolderIcon className="h-4 w-4" /> },
];

interface CollectionsTabProps {
  savedItems: DesignProps[];
  likedItems: DesignProps[];
}

const CollectionsTab = ({ savedItems, likedItems }: CollectionsTabProps) => {
  return (
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
          <CollectionFolder 
            key={folder.id} 
            folder={folder} 
            items={savedItems}
          />
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
  );
};

export default CollectionsTab;
