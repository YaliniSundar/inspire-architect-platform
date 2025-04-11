
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ImageIcon, UsersIcon, MessageSquareIcon, PlusCircle, Settings2Icon } from "lucide-react";
import { getFollowingList, getFollowersList } from '@/services/supabaseService';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DesignNestLogo from '@/components/DesignNestLogo';

const ArchitectDashboard = () => {
  const { user } = useAuth();
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [loadingFollowers, setLoadingFollowers] = useState(true);
  
  useEffect(() => {
    const loadFollowData = async () => {
      if (!user) return;
      
      try {
        setLoadingFollowers(true);
        // Load followers
        const followersData = await getFollowersList(user.id);
        if (followersData.data) {
          setFollowers(followersData.data.map((item: any) => item.profiles));
        }
        
        // Load following
        const followingData = await getFollowingList(user.id);
        if (followingData.data) {
          setFollowing(followingData.data.map((item: any) => item.profiles));
        }
      } catch (error) {
        console.error('Error loading follow data:', error);
      } finally {
        setLoadingFollowers(false);
      }
    };
    
    loadFollowData();
  }, [user]);
  
  // If user is not logged in or not an architect, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.userType !== 'architect') {
    return <Navigate to="/homeowner-dashboard" replace />;
  }
  
  return (
    <div className="container py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <DesignNestLogo size="sm" showDNOnly />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome, {user.name}!</h1>
            <p className="text-muted-foreground">
              Manage your portfolio, connect with clients, and showcase your designs.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/settings">
              <Settings2Icon className="h-4 w-4 mr-2" />
              Settings
            </Link>
          </Button>
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            <span>Upload Design</span>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="portfolio" className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full sm:w-auto">
          <TabsTrigger value="portfolio" className="flex items-center gap-1">
            <ImageIcon className="h-4 w-4" /> 
            <span className="hidden sm:inline">Portfolio</span>
          </TabsTrigger>
          <TabsTrigger value="followers" className="flex items-center gap-1">
            <UsersIcon className="h-4 w-4" /> 
            <span className="hidden sm:inline">Followers</span>
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-1">
            <MessageSquareIcon className="h-4 w-4" /> 
            <span className="hidden sm:inline">Messages</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="portfolio">
          <Card>
            <CardHeader>
              <CardTitle>Your Portfolio</CardTitle>
              <CardDescription>Manage and showcase your architectural designs.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="py-10 text-center text-muted-foreground">
                <p>You haven't uploaded any designs yet.</p>
                <p>Start building your portfolio by uploading your work!</p>
                <Button className="mt-4 flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Upload Design
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="followers">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Followers */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle>Your Followers</CardTitle>
                <CardDescription>Users who are following your work.</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingFollowers ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">Loading followers...</p>
                  </div>
                ) : followers.length > 0 ? (
                  <div className="space-y-4">
                    {followers.map(follower => (
                      <div key={follower.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={follower.profile_picture} />
                            <AvatarFallback>{follower.full_name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{follower.full_name}</p>
                            <p className="text-xs text-muted-foreground">{follower.role === 'architect' ? 'Architect' : 'Homeowner'}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/profile/${follower.id}`}>View</Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-10 text-center text-muted-foreground">
                    <p>You don't have any followers yet.</p>
                    <p>Complete your profile and upload designs to attract followers!</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Following */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle>You're Following</CardTitle>
                <CardDescription>Architects and homeowners you follow.</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingFollowers ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">Loading following...</p>
                  </div>
                ) : following.length > 0 ? (
                  <div className="space-y-4">
                    {following.map(followedUser => (
                      <div key={followedUser.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={followedUser.profile_picture} />
                            <AvatarFallback>{followedUser.full_name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{followedUser.full_name}</p>
                            <p className="text-xs text-muted-foreground">{followedUser.role === 'architect' ? 'Architect' : 'Homeowner'}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/profile/${followedUser.id}`}>View</Link>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-500 border-red-200 hover:bg-red-50"
                            onClick={() => {/* Handle unfollow */}}
                          >
                            Unfollow
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-10 text-center text-muted-foreground">
                    <p>You're not following anyone yet.</p>
                    <p>Follow other architects and homeowners to see their work!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Client Messages</CardTitle>
              <CardDescription>Inquiries and messages from potential clients.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="py-10 text-center text-muted-foreground">
                <p>You don't have any messages yet.</p>
                <p>Messages from interested clients will appear here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ArchitectDashboard;
