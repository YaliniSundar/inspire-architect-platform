
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { sendVerificationEmail, verifyEmail } from '@/services/authService';
import { ArrowLeft } from 'lucide-react';
import { Mail } from 'lucide-react';

const OTPVerification = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [signupData, setSignupData] = useState<any>(null);
  
  useEffect(() => {
    // Retrieve signup data from session storage
    const data = sessionStorage.getItem('signupData');
    if (!data) {
      navigate('/signup');
      return;
    }
    setSignupData(JSON.parse(data));
    
    // Send verification email on component mount
    const userData = JSON.parse(data);
    sendVerificationEmail(userData.email);
    
    // Start countdown for resend email
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [navigate]);
  
  const handleResendVerification = () => {
    if (countdown > 0) return;
    
    // Reset countdown
    setCountdown(60);
    
    // Resend verification email
    if (signupData?.email) {
      sendVerificationEmail(signupData.email);
      
      toast({
        title: "Verification Email Resent",
        description: "A new verification email has been sent to your email address.",
      });
    }
  };

  const handleGoBack = () => {
    navigate('/signup');
  };
  
  // This is just for demo purposes to simulate email verification
  // In a real app, this button wouldn't exist - user would click link in email
  const handleSimulateVerification = () => {
    setIsLoading(true);
    
    if (signupData?.email) {
      // Simulate verification
      verifyEmail(signupData.email);
      
      // Navigate to set password
      setTimeout(() => {
        navigate('/create-password');
        
        toast({
          title: "Email verified successfully",
          description: "Please create a password for your account.",
        });
        
        setIsLoading(false);
      }, 1500);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="icon" onClick={handleGoBack} className="mr-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="text-center flex-1">
          <p className="text-muted-foreground mb-2">
            Verification email sent to 
            <span className="font-medium text-foreground"> {signupData?.email}</span>
          </p>
        </div>
      </div>
      
      <div className="flex flex-col items-center justify-center py-6 space-y-4">
        <div className="bg-blue-50 p-4 rounded-full">
          <Mail className="h-10 w-10 text-blue-500" />
        </div>
        <h3 className="text-lg font-medium text-center">Check your email</h3>
        <p className="text-center text-muted-foreground max-w-sm">
          We've sent a verification link to your email address. 
          Please check your inbox and click the link to verify your account.
        </p>
      </div>
      
      <div className="text-center mt-4">
        <Button 
          variant="link" 
          onClick={handleResendVerification}
          disabled={countdown > 0}
          className="text-sm"
        >
          {countdown > 0 
            ? `Resend email in ${countdown}s` 
            : "Resend verification email"}
        </Button>
      </div>
      
      {/* This button is for demo purposes only - in a real app, users would click the email link */}
      <div className="mt-6 border-t pt-6">
        <p className="text-xs text-center text-muted-foreground mb-4">
          ⚠️ Demo Mode: In a real app, you would verify by clicking the link in your email.
        </p>
        <Button 
          onClick={handleSimulateVerification} 
          variant="outline"
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? "Verifying..." : "Simulate Email Verification"}
        </Button>
      </div>
    </div>
  );
};

export default OTPVerification;
