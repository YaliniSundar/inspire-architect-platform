
import { CalendarIcon, HeartIcon } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface AboutTabProps {
  profile: {
    about: string;
    education: { degree: string; institution: string; year: string }[];
    awards: { name: string; year: string }[];
    specialties: string[];
    contact: {
      email: string;
      website: string;
    };
    name: string;
  };
}

const AboutTab = ({ profile }: AboutTabProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* About Bio */}
      <div className="lg:col-span-2 space-y-8">
        <div>
          <h2 className="text-xl font-medium mb-4">About</h2>
          <p className="text-muted-foreground">{profile.about}</p>
        </div>
        
        <div>
          <h2 className="text-xl font-medium mb-4">Education</h2>
          <div className="space-y-4">
            {profile.education.map((edu, index) => (
              <div key={index} className="flex gap-3">
                <CalendarIcon className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">{edu.degree}</h3>
                  <p className="text-sm text-muted-foreground">{edu.institution}, {edu.year}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-medium mb-4">Awards & Recognitions</h2>
          <div className="space-y-4">
            {profile.awards.map((award, index) => (
              <div key={index} className="flex gap-3">
                <HeartIcon className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">{award.name}</h3>
                  <p className="text-sm text-muted-foreground">{award.year}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Sidebar info */}
      <div className="space-y-6">
        <div className="bg-muted/30 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Specializations</h3>
          <div className="flex flex-wrap gap-2">
            {profile.specialties.map((specialty, index) => (
              <Badge key={index} variant="secondary">{specialty}</Badge>
            ))}
          </div>
        </div>
        
        <div className="bg-muted/30 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Contact Information</h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Email</p>
              <p className="font-medium">{profile.contact.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Website</p>
              <p className="font-medium">{profile.contact.website}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-background border rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Hire for a Project</h3>
          <p className="text-sm text-muted-foreground mb-4">Interested in working with {profile.name.split(' ')[0]}? Get in touch to discuss your project.</p>
          <Button className="w-full">Start a Project</Button>
        </div>
      </div>
    </div>
  );
};

// Add missing Button import
import { Button } from "@/components/ui/button";

export default AboutTab;
