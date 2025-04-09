
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthWrapper from '@/components/auth/AuthWrapper';
import ArchitectProfileForm from '@/components/auth/ArchitectProfileForm';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const ArchitectProfilePage = () => {
  const { user, updateUserType } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handler for when the profile form is submitted
  const handleProfileComplete = async (formData: any) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      // If user is not an architect yet, update their user type
      if (user.userType !== 'architect') {
        await updateUserType('architect');
      }
      
      // In a real app, we would save the profile data to the database here
      
      toast({
        title: "Profile updated",
        description: "Your architect profile has been successfully created!",
      });
      
      // Redirect to the user's profile page
      navigate(`/profile/${user.id}`);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "There was a problem updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <AuthWrapper 
      title="Complete your architect profile" 
      description="Tell us more about your professional background to showcase your expertise to potential clients."
    >
      {/* Here we need to spread the props as expected by ArchitectProfileForm */}
      <ArchitectProfileForm 
        onFormSubmit={handleProfileComplete}
        isLoading={isSubmitting}
      />
    </AuthWrapper>
  );
};

export default ArchitectProfilePage;
