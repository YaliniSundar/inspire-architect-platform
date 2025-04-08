
import { ChevronDownIcon, FolderIcon } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import DesignCard, { DesignProps } from '@/components/DesignCard';

interface CollectionFolderProps {
  folder: {
    id: string;
    name: string;
    icon: JSX.Element;
  };
  items: DesignProps[];
}

const CollectionFolder = ({ folder, items }: CollectionFolderProps) => {
  const filteredItems = items.filter(item => 
    item.tags.some(tag => tag.toLowerCase().includes(folder.id.toLowerCase()))
  );
  
  return (
    <Collapsible className="border rounded-lg">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left font-medium">
        <div className="flex items-center gap-2">
          {folder.icon}
          <span>{folder.name}</span>
          <Badge variant="secondary" className="ml-2">
            {filteredItems.length}
          </Badge>
        </div>
        <ChevronDownIcon className="h-5 w-5 transition-transform ui-open:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((design) => (
            <DesignCard key={design.id} design={design} compact />
          ))}
        </div>
        {filteredItems.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No saved items in this folder</p>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CollectionFolder;
