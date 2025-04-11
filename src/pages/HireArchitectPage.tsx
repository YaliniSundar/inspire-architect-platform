
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getProfile, 
  hireArchitect, 
  getHiringStatus 
} from '@/services/supabaseService';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MapPinIcon, 
  MailIcon, 
  PhoneIcon, 
  BriefcaseIcon,
  CheckCircle,
  Globe
} from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { toast } from '@/components/ui/use-toast';

const HireArchitectPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [architect, setArchitect] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hiringStatus, setHiringStatus] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadArchitect = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        // Load architect details
        const { data, error } = await getProfile(id);
        if (error) throw error;
        setArchitect(data);

        // Check if already hired
        if (user) {
          const { status } = await getHiringStatus(user.id, id);
          setHiringStatus(status);
        }
      } catch (error) {
        console.error("Error loading architect:", error);
        toast({
          title: "Error loading architect profile",
          description: "Could not load the architect's details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadArchitect();
  }, [id, user]);

  const handleHire = async () => {
    if (!user || !id) {
      toast({
        title: "Login required",
        description: "You need to be logged in to hire an architect",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    setSubmitting(true);
    try {
      const { success, error } = await hireArchitect(user.id, id, message);
      if (error) throw error;
      
      if (success) {
        setHiringStatus('pending');
        toast({
          title: "Hire request sent",
          description: "Your request has been sent to the architect.",
        });
      }
    } catch (error) {
      console.error("Error hiring architect:", error);
      toast({
        title: "Failed to hire architect",
        description: "Your request could not be sent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-16 text-center">
        <div className="flex flex-col items-center gap-4">
          <p className="text-muted-foreground">Loading architect details...</p>
          <Progress value={80} className="w-64" />
        </div>
      </div>
    );
  }

  if (!architect) {
    return (
      <div className="container py-16 text-center">
        <h2 className="text-2xl font-medium mb-2">Architect not found</h2>
        <p className="text-muted-foreground mb-6">The architect you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/architects')}>View all architects</Button>
      </div>
    );
  }

  const isHired = hiringStatus === 'accepted';
  const isPending = hiringStatus === 'pending';
  
  return (
    <div className="container max-w-4xl py-12">
      <h1 className="text-3xl font-bold mb-8">Hire Architect</h1>
      
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={architect.profile_picture} alt={architect.full_name} />
            <AvatarFallback>{architect.full_name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-2xl">{architect.full_name}</CardTitle>
              {(isHired || isPending) && (
                <Badge variant={isHired ? "success" : "info"}>
                  {isHired ? "Hired" : "Pending"}
                </Badge>
              )}
            </div>
            <CardDescription>{architect.architect_profiles?.specialization || "Architect"}</CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <MailIcon className="h-4 w-4 text-muted-foreground" />
              <span>{architect.email || "Email not available"}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <PhoneIcon className="h-4 w-4 text-muted-foreground" />
              <span>{architect.phone || "Phone not available"}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPinIcon className="h-4 w-4 text-muted-foreground" />
              <span>{architect.location || "Location not specified"}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
              <span>{architect.architect_profiles?.years_experience || "0"} years experience</span>
            </div>
            
            {architect.website && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <a href={architect.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {architect.website.replace(/(^\w+:|^)\/\//, '')}
                </a>
              </div>
            )}
          </div>
          
          {architect.architect_profiles?.bio && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">About</h3>
              <p className="text-muted-foreground">{architect.architect_profiles.bio}</p>
            </div>
          )}
          
          {architect.architect_profiles?.educational_background && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Education</h3>
              <p className="text-muted-foreground">{architect.architect_profiles.educational_background}</p>
            </div>
          )}
          
          {architect.architect_profiles?.specialization && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Specialization</h3>
              <div className="flex flex-wrap gap-2">
                {architect.architect_profiles.specialization.split(',').map((specialty: string, index: number) => (
                  <Badge key={index} variant="outline">{specialty.trim()}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {!isHired && !isPending && (
        <Card>
          <CardHeader>
            <CardTitle>Send Hiring Request</CardTitle>
            <CardDescription>
              Let the architect know what you're looking for and why you'd like to work with them.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea 
              placeholder="Write a message to the architect..."
              className="min-h-[120px]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button 
              onClick={handleHire}
              disabled={submitting}
            >
              {submitting ? "Sending Request..." : "Hire Now"}
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {isHired && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">You've already hired this architect</span>
            </div>
            <p className="text-muted-foreground mt-2">
              You can message them directly or wait for them to contact you.
            </p>
          </CardContent>
        </Card>
      )}
      
      {isPending && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-blue-700">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Hire request pending</span>
            </div>
            <p className="text-muted-foreground mt-2">
              You've sent a hire request to this architect. They will review your request soon.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Create Badge component for hire status
const Badge = ({ 
  children, 
  variant = "default"
}: { 
  children: React.ReactNode; 
  variant?: "default" | "success" | "info" | "warning" | "error" 
}) => {
  const variantClasses = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    info: "bg-blue-100 text-blue-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800"
  };

  return (
    <span className={`text-xs px-2 py-1 rounded-full font-medium ${variantClasses[variant]}`}>
      {children}
    </span>
  );
};

export default HireArchitectPage;
