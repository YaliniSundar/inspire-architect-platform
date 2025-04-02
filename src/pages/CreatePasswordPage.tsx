
import React from 'react';
import AuthWrapper from '@/components/auth/AuthWrapper';
import CreatePassword from '@/components/auth/CreatePassword';

const CreatePasswordPage = () => {
  return (
    <AuthWrapper 
      title="Create password" 
      description="Set a secure password for your account."
    >
      <CreatePassword />
    </AuthWrapper>
  );
};

export default CreatePasswordPage;
