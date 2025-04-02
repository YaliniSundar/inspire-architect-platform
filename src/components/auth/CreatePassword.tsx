
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

const passwordSchema = z.object({
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

const CreatePassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [signupData, setSignupData] = useState<any>(null);
  
  useEffect(() => {
    // Retrieve signup data from session storage
    const data = sessionStorage.getItem('signupData');
    if (!data) {
      navigate('/signup');
      return;
    }
    setSignupData(JSON.parse(data));
  }, [navigate]);
  
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });
  
  const onSubmit = async (data: PasswordFormValues) => {
    setIsLoading(true);
    
    try {
      // Combine signup data with password
      const userData = {
        ...signupData,
        password: data.password,
      };
      
      // In a real application, you would call an API to register the user
      console.log('Creating user account:', userData);
      
      // Mock successful registration
      setTimeout(() => {
        // Clear session storage
        sessionStorage.removeItem('signupData');
        
        // If architect, redirect to complete profile
        if (signupData?.userType === 'architect') {
          sessionStorage.setItem('tempUserId', 'architect-123'); // Mock user ID
          navigate('/architect-profile');
        } else {
          // If homeowner, registration is complete
          // In a real app you would save auth token and redirect to dashboard
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('user', JSON.stringify({
            id: 'homeowner-123',
            name: signupData?.name,
            email: signupData?.email,
            userType: 'homeowner'
          }));
          
          navigate('/');
        }
        
        toast({
          title: "Account created successfully",
          description: signupData?.userType === 'architect' 
            ? "Please complete your architect profile."
            : "You are now logged in to your account.",
        });
      }, 1000);
    } catch (error) {
      console.error(error);
      toast({
        title: "Registration failed",
        description: "There was a problem creating your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="text-center mb-4">
          <p className="text-muted-foreground">Create a secure password for your account</p>
        </div>
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Create a password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Confirm your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="text-sm text-muted-foreground space-y-1 mt-2">
          <p>Password must:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Be at least 8 characters</li>
            <li>Include at least one uppercase letter</li>
            <li>Include at least one lowercase letter</li>
            <li>Include at least one number</li>
          </ul>
        </div>
        
        <Button type="submit" className="w-full mt-6" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>
      </form>
    </Form>
  );
};

export default CreatePassword;
