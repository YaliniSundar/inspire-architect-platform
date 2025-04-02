
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

const architectProfileSchema = z.object({
  yearsExperience: z.string().min(1, { message: 'Please provide your years of experience' }),
  education: z.string().min(3, { message: 'Please provide your educational details' }),
  specialization: z.string().min(3, { message: 'Please provide your area of specialization' }),
  bio: z.string().min(10, { message: 'Bio should be at least 10 characters' }).max(500, { message: 'Bio should not exceed 500 characters' }),
  portfolio: z.string().url({ message: 'Please provide a valid portfolio URL' }).optional().or(z.literal('')),
});

type ArchitectProfileFormValues = z.infer<typeof architectProfileSchema>;

const ArchitectProfileForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  
  useEffect(() => {
    // Check if user was redirected from registration
    const tempUserId = sessionStorage.getItem('tempUserId');
    if (!tempUserId) {
      navigate('/signup');
      return;
    }
    
    // In a real app, you'd fetch user data from API using this ID
    const signupData = sessionStorage.getItem('signupData');
    if (signupData) {
      setUserData(JSON.parse(signupData));
    }
  }, [navigate]);
  
  const form = useForm<ArchitectProfileFormValues>({
    resolver: zodResolver(architectProfileSchema),
    defaultValues: {
      yearsExperience: '',
      education: '',
      specialization: '',
      bio: '',
      portfolio: '',
    },
  });
  
  const onSubmit = async (data: ArchitectProfileFormValues) => {
    setIsLoading(true);
    
    try {
      // Combine all user data
      const completeProfile = {
        ...userData,
        ...data,
      };
      
      // In a real application, you would call an API to save architect profile
      console.log('Saving architect profile:', completeProfile);
      
      // Mock successful profile creation
      setTimeout(() => {
        // Clear session storage
        sessionStorage.removeItem('signupData');
        sessionStorage.removeItem('tempUserId');
        
        // Save user data to localStorage (in a real app, you'd use proper auth)
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify({
          id: 'architect-123',
          name: userData?.name,
          email: userData?.email,
          userType: 'architect',
          profile: data
        }));
        
        navigate('/');
        
        toast({
          title: "Profile created successfully",
          description: "Your architect profile is now complete.",
        });
      }, 1000);
    } catch (error) {
      console.error(error);
      toast({
        title: "Profile creation failed",
        description: "There was a problem saving your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="mb-4">
          <h3 className="text-lg font-medium">Complete Your Architect Profile</h3>
          <p className="text-muted-foreground text-sm">
            Please provide your professional details to create your architect portfolio
          </p>
        </div>
        
        <FormField
          control={form.control}
          name="yearsExperience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Years of Experience</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 5 years" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="education"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Educational Background</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Bachelor of Architecture, Harvard University" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="specialization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Area of Specialization</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Residential Architecture, Sustainable Design" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Professional Bio</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Write a brief description about your professional background, design philosophy, and notable projects..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This will be displayed on your public profile
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="portfolio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Portfolio URL (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://your-portfolio-website.com" {...field} />
              </FormControl>
              <FormDescription>
                Link to your existing portfolio website or social profiles
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full mt-6" disabled={isLoading}>
          {isLoading ? "Saving profile..." : "Complete Registration"}
        </Button>
      </form>
    </Form>
  );
};

export default ArchitectProfileForm;
