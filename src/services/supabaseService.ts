
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

// Types for user signup and login
export type SignupFormValues = {
  name: string;
  email: string;
  password: string;
  userType: 'architect' | 'homeowner';
};

export type LoginFormValues = {
  email: string;
  password: string;
};

// Authentication services
export const signUp = async (data: SignupFormValues) => {
  try {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
          userType: data.userType
        }
      }
    });
    
    if (error) throw error;
    
    toast({
      title: "Account created successfully",
      description: "Please check your email for verification.",
    });
    
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error signing up:", error);
    
    toast({
      title: "Sign up failed",
      description: error.message || "An error occurred during sign up.",
      variant: "destructive",
    });
    
    return { success: false, error };
  }
};

export const signIn = async (data: LoginFormValues) => {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    
    if (error) throw error;
    
    toast({
      title: "Logged in successfully",
      description: "Welcome back to Design Next!",
    });
    
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error signing in:", error);
    
    toast({
      title: "Login failed",
      description: error.message || "Invalid email or password.",
      variant: "destructive",
    });
    
    return { success: false, error };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;
    
    toast({
      title: "Logged out successfully",
    });
    
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error signing out:", error);
    
    toast({
      title: "Sign out failed",
      description: error.message || "An error occurred during sign out.",
      variant: "destructive",
    });
    
    return { success: false, error };
  }
};

// Profile functions
export const getProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*, architect_profiles(*), homeowner_profiles(*)')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error: any) {
    console.error("Error fetching profile:", error);
    return { data: null, error };
  }
};

export const updateProfile = async (userId: string, updates: any) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    
    toast({
      title: "Profile updated successfully",
    });
    
    return { data, error: null };
  } catch (error: any) {
    console.error("Error updating profile:", error);
    
    toast({
      title: "Profile update failed",
      description: error.message || "An error occurred during update.",
      variant: "destructive",
    });
    
    return { data: null, error };
  }
};

// User role-based functions
export const updateArchitectProfile = async (userId: string, updates: any) => {
  try {
    const { data, error } = await supabase
      .from('architect_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    
    toast({
      title: "Architect profile updated successfully",
    });
    
    return { data, error: null };
  } catch (error: any) {
    console.error("Error updating architect profile:", error);
    
    toast({
      title: "Profile update failed",
      description: error.message || "An error occurred during update.",
      variant: "destructive",
    });
    
    return { data: null, error };
  }
};

export const updateHomeownerProfile = async (userId: string, updates: any) => {
  try {
    const { data, error } = await supabase
      .from('homeowner_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    
    toast({
      title: "Homeowner profile updated successfully",
    });
    
    return { data, error: null };
  } catch (error: any) {
    console.error("Error updating homeowner profile:", error);
    
    toast({
      title: "Profile update failed",
      description: error.message || "An error occurred during update.",
      variant: "destructive",
    });
    
    return { data: null, error };
  }
};
