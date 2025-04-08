
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import DesignCard, { DesignProps } from '@/components/DesignCard';
import UploadDesign from './UploadDesign';

interface DesignsTabProps {
  profileId: string;
  isOwnProfile: boolean;
  userType?: string;
  designs: DesignProps[];
  onAddDesign?: (design: any) => void;
}

const DesignsTab = ({ profileId, isOwnProfile, userType, designs, onAddDesign }: DesignsTabProps) => {
  return (
    <div className="space-y-6">
      {isOwnProfile && userType === 'architect' && (
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-medium">My Designs</h2>
          <UploadDesign onUploadSuccess={onAddDesign} />
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {designs.map((design) => (
          <DesignCard key={design.id} design={design} />
        ))}
      </div>
      
      {designs.length === 0 && (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <h3 className="text-lg font-medium mb-2">No designs yet</h3>
          <p className="text-muted-foreground">
            {isOwnProfile 
              ? "You haven't uploaded any designs yet." 
              : "This architect hasn't uploaded any designs yet."}
          </p>
          {isOwnProfile && userType === 'architect' && (
            <UploadDesign onUploadSuccess={onAddDesign} />
          )}
        </div>
      )}
    </div>
  );
};

export default DesignsTab;
