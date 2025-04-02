
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from '@/components/ui/use-toast';

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
      // In a real application, you would verify the OTP with an API
      console.log('Verifying OTP:', otp);
      
      // Mock successful verification
      setTimeout(() => {
        // Navigate to set password
        navigate('/create-password');
        
        toast({
          title: "Verification successful",
          description: "Please create a password for your account.",
        });
      }, 1000);
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
    
    // In a real application, you would call an API to resend the code
    setCountdown(60);
    
    toast({
      title: "Verification code resent",
      description: `A new code has been sent to ${signupData?.email}.`,
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-muted-foreground mb-2">
          Enter the 6-digit code sent to 
          <span className="font-medium text-foreground"> {signupData?.email}</span>
        </p>
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
