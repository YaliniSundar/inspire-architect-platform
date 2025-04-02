
import React from 'react';
import AuthWrapper from '@/components/auth/AuthWrapper';
import LoginForm from '@/components/auth/LoginForm';

const LoginPage = () => {
  return (
    <AuthWrapper 
      title="Welcome back" 
      description="Sign in to your Design Next account."
    >
      <LoginForm />
    </AuthWrapper>
  );
};

export default LoginPage;
