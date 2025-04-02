
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
    
    // Send OTP email on component mount
    sendOTPEmail(JSON.parse(data).email);
    
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
  
  // Function to send OTP email
  const sendOTPEmail = async (email: string) => {
    try {
      // In a real application, this would be an API call to your backend
      // For demo purposes, we'll simulate the API call
      console.log(`Sending OTP to email: ${email}`);
      
      // Mock API call
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      }).catch(() => {
        // If fetch fails (no backend), simulate successful response for demo
        console.log('No backend detected, simulating OTP send');
        return { ok: true, json: () => Promise.resolve({ success: true }) };
      });
      
      if (response.ok) {
        toast({
          title: "Verification code sent",
          description: `A verification code has been sent to ${email}.`,
        });
      } else {
        throw new Error('Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast({
        title: "Failed to send verification code",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    }
  };
  
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
      
      // Mock API verification
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: signupData.email,
          otp 
        }),
      }).catch(() => {
        // If fetch fails (no backend), simulate successful response for demo
        console.log('No backend detected, simulating OTP verification');
        
        // For demo purposes, any 6-digit code is accepted
        return { 
          ok: true, 
          json: () => Promise.resolve({ 
            success: true,
            message: 'OTP verified successfully' 
          }) 
        };
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Navigate to set password
        navigate('/create-password');
        
        toast({
          title: "Verification successful",
          description: "Please create a password for your account.",
        });
      } else {
        throw new Error(data.message || 'Invalid verification code');
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
    }
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
              {slots && slots.map((slot, i) => (
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
