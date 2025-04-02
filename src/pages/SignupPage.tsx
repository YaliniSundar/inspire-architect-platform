
import React from 'react';
import AuthWrapper from '@/components/auth/AuthWrapper';
import SignupForm from '@/components/auth/SignupForm';
import { Link } from 'react-router-dom';

const SignupPage = () => {
  return (
    <AuthWrapper 
      title="Create an account" 
      description="Sign up to start exploring or showcasing architectural designs."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      }
    >
      <SignupForm />
    </AuthWrapper>
  );
};

export default SignupPage;
