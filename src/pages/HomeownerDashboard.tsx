import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { HeartIcon, UsersIcon, BookmarkIcon, SparklesIcon, Settings2Icon } from "lucide-react";
import { getFollowingList, getFollowersList, unfollowArchitect } from '@/services/supabaseService';
import DesignNestLogo from '@/components/DesignNestLogo';

const HomeownerDashboard = () => {
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
  
  // If user is not logged in or not a homeowner, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.userType !== 'homeowner') {
    return <Navigate to="/architect-dashboard" replace />;
  }
  
  return (
    <div className="container py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <DesignNestLogo size="sm" showDNOnly />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome, {user.name}!</h1>
            <p className="text-muted-foreground">
              Browse architectural designs, save inspiration, and generate blueprint ideas.
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/settings">
            <Settings2Icon className="h-4 w-4 mr-2" />
            Settings
          </Link>
        </Button>
      </div>
      
      <Tabs defaultValue="liked-posts" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full sm:w-auto">
          <TabsTrigger value="liked-posts" className="flex items-center gap-1">
            <HeartIcon className="h-4 w-4" /> 
            <span className="hidden sm:inline">Liked Posts</span>
          </TabsTrigger>
          <TabsTrigger value="following" className="flex items-center gap-1">
            <UsersIcon className="h-4 w-4" /> 
            <span className="hidden sm:inline">Following</span>
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center gap-1">
            <BookmarkIcon className="h-4 w-4" /> 
            <span className="hidden sm:inline">Saved</span>
          </TabsTrigger>
          <TabsTrigger value="ai-generator" className="flex items-center gap-1">
            <SparklesIcon className="h-4 w-4" /> 
            <span className="hidden sm:inline">AI Generator</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="liked-posts">
          <Card>
            <CardHeader>
              <CardTitle>Liked Posts</CardTitle>
              <CardDescription>Designs and ideas that you've liked.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="py-10 text-center text-muted-foreground">
                <p>You haven't liked any posts yet.</p>
                <p>Start exploring designs to find inspiration!</p>
                <Button className="mt-4" asChild>
                  <Link to="/explore">Browse Designs</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="following">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Following */}
            <Card>
              <CardHeader>
                <CardTitle>Architects You Follow</CardTitle>
                <CardDescription>Architects you're following and their latest designs.</CardDescription>
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
                            onClick={() => unfollowArchitect(user.id, followedUser.id).then(() => {
                              // Remove from local state after unfollowing
                              setFollowing(following.filter(u => u.id !== followedUser.id));
                            })}
                          >
                            Unfollow
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-10 text-center text-muted-foreground">
                    <p>You're not following any architects yet.</p>
                    <p>Follow architects to see their latest work!</p>
                    <Button className="mt-4" asChild>
                      <Link to="/architects">Browse Architects</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Followers */}
            <Card>
              <CardHeader>
                <CardTitle>Your Followers</CardTitle>
                <CardDescription>Users who are following your profile.</CardDescription>
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
                    <p>Complete your profile to attract followers!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="saved">
          <Card>
            <CardHeader>
              <CardTitle>Saved Blueprints</CardTitle>
              <CardDescription>Designs and blueprints you've saved for inspiration.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="py-10 text-center text-muted-foreground">
                <p>You haven't saved any blueprints yet.</p>
                <p>Save designs or generate AI blueprints!</p>
                <Button className="mt-4" asChild>
                  <Link to="/explore">Browse Designs</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ai-generator">
          <Card>
            <CardHeader>
              <CardTitle>AI Blueprint Generator</CardTitle>
              <CardDescription>Generate design ideas using AI based on your description.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                Describe your dream home and our AI will generate a conceptual blueprint for you.
              </p>
              <div className="py-10 text-center text-muted-foreground">
                <p>AI Blueprint Generator coming soon!</p>
                <p>Stay tuned for this exciting feature.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HomeownerDashboard;
