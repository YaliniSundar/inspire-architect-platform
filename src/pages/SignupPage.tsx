
import React from 'react';
import AuthWrapper from '@/components/auth/AuthWrapper';
import SignupForm from '@/components/auth/SignupForm';
import { Link } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

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
      <div className="space-y-4">
        <Alert variant="default" className="bg-blue-50 border-blue-200">
          <InfoIcon className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-sm text-blue-700">
            Please note that your selected role (Homeowner or Architect) cannot be changed after registration.
          </AlertDescription>
        </Alert>
        <SignupForm />
      </div>
    </AuthWrapper>
  );
};

export default SignupPage;
