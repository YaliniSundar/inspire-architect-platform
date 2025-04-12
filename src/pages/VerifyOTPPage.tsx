
import React, { useState, useEffect } from 'react';
import AuthWrapper from '@/components/auth/AuthWrapper';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import DesignNestLogo from '@/components/DesignNestLogo';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

const VerifyOTPPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState<string>('');
  
  useEffect(() => {
    // Check if we have an active auth session
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // If user is already authenticated, redirect to dashboard
        const userType = data.session.user?.user_metadata?.userType || 'homeowner';
        const dashboardPath = userType === 'architect' ? '/architect-dashboard' : '/homeowner-dashboard';
        navigate(dashboardPath, { replace: true });
      } else {
        // Try to get email from URL or localStorage
        const params = new URLSearchParams(window.location.search);
        const emailParam = params.get('email');
        const storedEmail = localStorage.getItem('signupEmail');
        
        if (emailParam) {
          setEmail(emailParam);
        } else if (storedEmail) {
          setEmail(storedEmail);
        }
      }
    };
    
    checkSession();
  }, [navigate]);
  
  const handleResendVerification = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter the email address you signed up with.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      
      if (error) throw error;
      
      toast({
        title: "Verification email sent",
        description: "Please check your inbox for the verification link.",
      });
    } catch (error: any) {
      console.error("Error resending verification:", error);
      toast({
        title: "Failed to resend verification",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoToLogin = () => {
    navigate('/login');
  };
  
  return (
    <AuthWrapper 
      title="Verify your email" 
      description="We've sent a verification link to your email address."
      logo={<DesignNestLogo showDNOnly size="lg" />}
    >
      <div className="space-y-4">
        <Alert variant="default" className="bg-blue-50 border-blue-200">
          <InfoIcon className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-sm text-blue-700">
            Please check your email and click on the verification link to complete your registration.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-2">
          <Button 
            onClick={handleResendVerification} 
            variant="outline" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Resend verification email"}
          </Button>
          
          <Button 
            onClick={handleGoToLogin} 
            variant="link" 
            className="w-full"
          >
            Return to login
          </Button>
        </div>
      </div>
    </AuthWrapper>
  );
};

export default VerifyOTPPage;
