import React, { createContext, useContext, useState, useEffect } from 'react';
import { updateUserProfile, getUserById } from '@/services/authService';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';

type User = {
  id: string;
  name: string;
  email: string;
  userType: 'homeowner' | 'architect';
  isActive?: boolean;
  profile?: any;
  savedItems?: string[];
  likedItems?: string[];
  following?: string[];
  followers?: string[];
} | null;

type AuthContextType = {
  user: User;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => Promise<void>;
  updateUserType: (userType: 'homeowner' | 'architect') => Promise<void>;
  disableAccount: () => Promise<void>;
  saveItem: (itemId: string) => Promise<void>;
  likeItem: (itemId: string) => Promise<void>;
  followUser: (userId: string) => Promise<void>;
  unfollowUser: (userId: string) => Promise<void>;
  removeSavedItem: (itemId: string) => Promise<void>;
  removeLikedItem: (itemId: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      setSession(currentSession);
      
      if (event === 'SIGNED_IN' && currentSession) {
        const user = currentSession.user;
        const userType = user.user_metadata.userType || 'homeowner';
        const name = user.user_metadata.name || '';
        
        setUser({
          id: user.id,
          name: name,
          email: user.email || '',
          userType: userType as 'homeowner' | 'architect',
          isActive: true,
          savedItems: [],
          likedItems: [],
          following: [],
          followers: []
        });
        setIsAuthenticated(true);
        
        toast({
          title: "Authentication successful",
          description: `Welcome back, ${name}!`,
        });
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
        setSession(null);
        
        toast({
          title: "Signed out",
          description: "You have been logged out successfully.",
        });
      }
    });
    
    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession) {
          setSession(currentSession);
          const user = currentSession.user;
          const userType = user.user_metadata.userType || 'homeowner';
          const name = user.user_metadata.name || '';
          
          setUser({
            id: user.id,
            name: name,
            email: user.email || '',
            userType: userType as 'homeowner' | 'architect',
            isActive: true,
            savedItems: [],
            likedItems: [],
            following: [],
            followers: []
          });
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const login = (userData: User) => {
    const userWithCollections = {
      ...userData,
      savedItems: userData.savedItems || [],
      likedItems: userData.likedItems || [],
      following: userData.following || [],
      followers: userData.followers || [],
      isActive: true
    };
    
    setUser(userWithCollections);
    setIsAuthenticated(true);
  };
  
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Sign out failed",
        description: error.message || "An error occurred during sign out.",
        variant: "destructive",
      });
      return Promise.reject(error);
    }
    
    return Promise.resolve();
  };
  
  const updateUserType = async (userType: 'homeowner' | 'architect'): Promise<void> => {
    if (!user) throw new Error('No user is logged in');
    
    const success = updateUserProfile(user.email, { userType });
    
    if (!success) throw new Error('Failed to update user type');
    
    const updatedUser = getUserById(user.id);
    
    if (!updatedUser) throw new Error('Failed to get updated user data');
    
    const newUser = { ...user, userType };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    return Promise.resolve();
  };
  
  const disableAccount = async (): Promise<void> => {
    if (!user) throw new Error('No user is logged in');
    
    const success = updateUserProfile(user.email, { isActive: false });
    
    if (!success) throw new Error('Failed to disable account');
    
    return Promise.resolve();
  };
  
  const saveItem = async (itemId: string): Promise<void> => {
    if (!user) throw new Error('No user is logged in');
    
    if (!user.savedItems?.includes(itemId)) {
      const savedItems = [...(user.savedItems || []), itemId];
      
      const success = updateUserProfile(user.email, { savedItems });
      
      if (!success) throw new Error('Failed to save item');
      
      const newUser = { ...user, savedItems };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    }
    
    return Promise.resolve();
  };
  
  const likeItem = async (itemId: string): Promise<void> => {
    if (!user) throw new Error('No user is logged in');
    
    if (!user.likedItems?.includes(itemId)) {
      const likedItems = [...(user.likedItems || []), itemId];
      
      const success = updateUserProfile(user.email, { likedItems });
      
      if (!success) throw new Error('Failed to like item');
      
      const newUser = { ...user, likedItems };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    }
    
    return Promise.resolve();
  };
  
  const followUser = async (userId: string): Promise<void> => {
    if (!user) throw new Error('No user is logged in');
    
    if (!user.following?.includes(userId)) {
      const following = [...(user.following || []), userId];
      
      const success = updateUserProfile(user.email, { following });
      
      if (!success) throw new Error('Failed to follow user');
      
      const newUser = { ...user, following };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    }
    
    return Promise.resolve();
  };
  
  const unfollowUser = async (userId: string): Promise<void> => {
    if (!user) throw new Error('No user is logged in');
    
    const following = user.following?.filter(id => id !== userId) || [];
    
    const success = updateUserProfile(user.email, { following });
    
    if (!success) throw new Error('Failed to unfollow user');
    
    const newUser = { ...user, following };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    return Promise.resolve();
  };
  
  const removeSavedItem = async (itemId: string): Promise<void> => {
    if (!user) throw new Error('No user is logged in');
    
    const savedItems = user.savedItems?.filter(id => id !== itemId) || [];
    
    const success = updateUserProfile(user.email, { savedItems });
    
    if (!success) throw new Error('Failed to remove saved item');
    
    const newUser = { ...user, savedItems };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    return Promise.resolve();
  };
  
  const removeLikedItem = async (itemId: string): Promise<void> => {
    if (!user) throw new Error('No user is logged in');
    
    const likedItems = user.likedItems?.filter(id => id !== itemId) || [];
    
    const success = updateUserProfile(user.email, { likedItems });
    
    if (!success) throw new Error('Failed to remove liked item');
    
    const newUser = { ...user, likedItems };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    return Promise.resolve();
  };
  
  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    if (!user) throw new Error('No user is logged in');
    
    const success = updateUserProfile(user.email, updates);
    
    if (!success) throw new Error('Failed to update profile');
    
    const newUser = { ...user, ...updates };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    return Promise.resolve();
  };
  
  const value = {
    user,
    session,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUserType,
    disableAccount,
    saveItem,
    likeItem,
    followUser,
    unfollowUser,
    removeSavedItem,
    removeLikedItem,
    updateProfile
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
