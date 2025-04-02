
import React from 'react';
import AuthWrapper from '@/components/auth/AuthWrapper';
import OTPVerification from '@/components/auth/OTPVerification';

const VerifyOTPPage = () => {
  return (
    <AuthWrapper 
      title="Verify your email" 
      description="We've sent a verification code to your email address."
    >
      <OTPVerification />
    </AuthWrapper>
  );
};

export default VerifyOTPPage;
