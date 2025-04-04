
import React, { createContext, useContext, useState, useEffect } from 'react';
import { updateUserProfile, getUserById } from '@/services/authService';

type User = {
  id: string;
  name: string;
  email: string;
  userType: 'homeowner' | 'architect';
  isActive?: boolean;
  profile?: any;
  savedItems?: string[];
  likedItems?: string[];
} | null;

type AuthContextType = {
  user: User;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  updateUserType: (userType: 'homeowner' | 'architect') => Promise<void>;
  disableAccount: () => Promise<void>;
  saveItem: (itemId: string) => Promise<void>;
  likeItem: (itemId: string) => Promise<void>;
  removeSavedItem: (itemId: string) => Promise<void>;
  removeLikedItem: (itemId: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Check if user is already logged in from localStorage
    const storedAuth = localStorage.getItem('isAuthenticated');
    const storedUser = localStorage.getItem('user');
    
    if (storedAuth === 'true' && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
      }
    }
  }, []);
  
  const login = (userData: User) => {
    // Initialize empty arrays for saved and liked items if they don't exist
    const userWithCollections = {
      ...userData,
      savedItems: userData.savedItems || [],
      likedItems: userData.likedItems || [],
      isActive: true
    };
    
    setUser(userWithCollections);
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify(userWithCollections));
  };
  
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  };
  
  const updateUserType = async (userType: 'homeowner' | 'architect'): Promise<void> => {
    if (!user) throw new Error('No user is logged in');
    
    // Update user type in the "database"
    const success = updateUserProfile(user.email, { userType });
    
    if (!success) throw new Error('Failed to update user type');
    
    // Get the updated user data
    const updatedUser = getUserById(user.id);
    
    if (!updatedUser) throw new Error('Failed to get updated user data');
    
    // Update local state
    const newUser = { ...user, userType };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    return Promise.resolve();
  };
  
  const disableAccount = async (): Promise<void> => {
    if (!user) throw new Error('No user is logged in');
    
    // Update user status in the "database"
    const success = updateUserProfile(user.email, { isActive: false });
    
    if (!success) throw new Error('Failed to disable account');
    
    // We don't update the local state here because we'll log out afterwards
    return Promise.resolve();
  };
  
  const saveItem = async (itemId: string): Promise<void> => {
    if (!user) throw new Error('No user is logged in');
    
    // Add item to saved items if not already saved
    if (!user.savedItems?.includes(itemId)) {
      const savedItems = [...(user.savedItems || []), itemId];
      
      // Update in the "database"
      const success = updateUserProfile(user.email, { savedItems });
      
      if (!success) throw new Error('Failed to save item');
      
      // Update local state
      const newUser = { ...user, savedItems };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    }
    
    return Promise.resolve();
  };
  
  const likeItem = async (itemId: string): Promise<void> => {
    if (!user) throw new Error('No user is logged in');
    
    // Add item to liked items if not already liked
    if (!user.likedItems?.includes(itemId)) {
      const likedItems = [...(user.likedItems || []), itemId];
      
      // Update in the "database"
      const success = updateUserProfile(user.email, { likedItems });
      
      if (!success) throw new Error('Failed to like item');
      
      // Update local state
      const newUser = { ...user, likedItems };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    }
    
    return Promise.resolve();
  };
  
  const removeSavedItem = async (itemId: string): Promise<void> => {
    if (!user) throw new Error('No user is logged in');
    
    // Remove item from saved items
    const savedItems = user.savedItems?.filter(id => id !== itemId) || [];
    
    // Update in the "database"
    const success = updateUserProfile(user.email, { savedItems });
    
    if (!success) throw new Error('Failed to remove saved item');
    
    // Update local state
    const newUser = { ...user, savedItems };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    return Promise.resolve();
  };
  
  const removeLikedItem = async (itemId: string): Promise<void> => {
    if (!user) throw new Error('No user is logged in');
    
    // Remove item from liked items
    const likedItems = user.likedItems?.filter(id => id !== itemId) || [];
    
    // Update in the "database"
    const success = updateUserProfile(user.email, { likedItems });
    
    if (!success) throw new Error('Failed to remove liked item');
    
    // Update local state
    const newUser = { ...user, likedItems };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    return Promise.resolve();
  };
  
  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    updateUserType,
    disableAccount,
    saveItem,
    likeItem,
    removeSavedItem,
    removeLikedItem
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
