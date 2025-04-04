
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from '@/components/ui/use-toast';
import { sendOTPEmail, verifyOTP } from '@/services/authService';
import { ArrowLeft } from 'lucide-react';

const OTPVerification = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
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
    
    // Send OTP email on component mount
    const userData = JSON.parse(data);
    sendOTPEmail(userData.email);
    
    // Start countdown for resend code
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
  
  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the complete 6-digit code.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Verify OTP with our service
      const isValid = verifyOTP(signupData.email, otp);
      
      if (isValid) {
        // Navigate to set password
        navigate('/create-password');
        
        toast({
          title: "Verification successful",
          description: "Please create a password for your account.",
        });
      } else {
        throw new Error('Invalid verification code');
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Verification failed",
        description: "The code you entered is incorrect or has expired.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResendOTP = () => {
    if (countdown > 0) return;
    
    // Reset countdown
    setCountdown(60);
    
    // Resend OTP
    if (signupData?.email) {
      sendOTPEmail(signupData.email);
      
      toast({
        title: "OTP Resent",
        description: "A new verification code has been sent to your email.",
      });
    }
  };

  const handleGoBack = () => {
    navigate('/signup');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="icon" onClick={handleGoBack} className="mr-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="text-center flex-1">
          <p className="text-muted-foreground mb-2">
            Enter the 6-digit code sent to 
            <span className="font-medium text-foreground"> {signupData?.email}</span>
          </p>
        </div>
      </div>
      
      <div className="flex justify-center mb-6">
        <InputOTP 
          maxLength={6}
          value={otp}
          onChange={setOtp}
          render={({ slots }) => (
            <InputOTPGroup>
              {slots.map((slot, i) => (
                <InputOTPSlot key={i} {...slot} index={i} />
              ))}
            </InputOTPGroup>
          )}
        />
      </div>
      
      <Button 
        onClick={handleVerifyOTP} 
        className="w-full" 
        disabled={otp.length !== 6 || isLoading}
      >
        {isLoading ? "Verifying..." : "Verify Code"}
      </Button>
      
      <div className="text-center mt-4">
        <Button 
          variant="link" 
          onClick={handleResendOTP}
          disabled={countdown > 0}
          className="text-sm"
        >
          {countdown > 0 
            ? `Resend code in ${countdown}s` 
            : "Resend code"}
        </Button>
      </div>
    </div>
  );
};

export default OTPVerification;
