
import React from 'react';
import AuthWrapper from '@/components/auth/AuthWrapper';
import LoginForm from '@/components/auth/LoginForm';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  return (
    <AuthWrapper 
      title="Welcome back" 
      description="Sign in to your Design Next account."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      }
    >
      <LoginForm />
    </AuthWrapper>
  );
};

export default LoginPage;
