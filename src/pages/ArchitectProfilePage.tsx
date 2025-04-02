
import React from 'react';
import AuthWrapper from '@/components/auth/AuthWrapper';
import ArchitectProfileForm from '@/components/auth/ArchitectProfileForm';

const ArchitectProfilePage = () => {
  return (
    <AuthWrapper 
      title="Complete your profile" 
      description="Tell us more about your professional background."
    >
      <ArchitectProfileForm />
    </AuthWrapper>
  );
};

export default ArchitectProfilePage;
