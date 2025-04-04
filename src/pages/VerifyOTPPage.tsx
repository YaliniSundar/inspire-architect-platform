
import React from 'react';
import AuthWrapper from '@/components/auth/AuthWrapper';
import OTPVerification from '@/components/auth/OTPVerification';
import DesignNestLogo from '@/components/DesignNestLogo';

const VerifyOTPPage = () => {
  return (
    <AuthWrapper 
      title="Verify your email" 
      description="We've sent a verification code to your email address."
      logo={<DesignNestLogo showDNOnly size="lg" />}
    >
      <OTPVerification />
    </AuthWrapper>
  );
};

export default VerifyOTPPage;
