
import { CalendarIcon, HeartIcon, BriefcaseIcon, GraduationCapIcon } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";

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
    projects?: { 
      title: string; 
      description: string;
      year: string;
      location?: string; 
      imageUrl?: string;
    }[];
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
                <GraduationCapIcon className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
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
        
        {/* Featured Projects Section (for architects) */}
        {profile.projects && profile.projects.length > 0 && (
          <div>
            <h2 className="text-xl font-medium mb-4">Featured Projects</h2>
            <div className="space-y-6">
              {profile.projects.map((project, index) => (
                <Card key={index} className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    {project.imageUrl && (
                      <div className="md:w-1/3">
                        <img 
                          src={project.imageUrl} 
                          alt={project.title} 
                          className="w-full h-40 object-cover rounded-md"
                        />
                      </div>
                    )}
                    <div className={project.imageUrl ? "md:w-2/3" : "w-full"}>
                      <h3 className="text-lg font-medium">{project.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {project.year}{project.location ? `, ${project.location}` : ''}
                      </p>
                      <p className="text-sm">{project.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
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
          <Button className="w-full" asChild>
            <Link to={`/hire/${profile.id}`}>Start a Project</Link>
          </Button>
          <Separator className="my-4" />
          <Button variant="outline" className="w-full">
            <BriefcaseIcon className="h-4 w-4 mr-2" />
            View Full Portfolio
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AboutTab;
