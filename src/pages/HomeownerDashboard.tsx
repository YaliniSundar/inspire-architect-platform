
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { HeartIcon, BookmarkIcon, SparklesIcon, Settings2Icon, UsersIcon, MessageSquare, Calendar } from "lucide-react";
import DesignNestLogo from '@/components/DesignNestLogo';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";

// Define more precise types for activities
interface BaseActivity {
  created_at: string;
  type: 'like' | 'save' | 'follow';
}

interface LikeActivity extends BaseActivity {
  type: 'like';
  posts: {
    title: string;
    id: string;
    media_urls: string[];
    architect_id: string;
  };
}

interface SaveActivity extends BaseActivity {
  type: 'save';
  posts: {
    title: string;
    id: string;
    media_urls: string[];
    architect_id: string;
  };
}

interface FollowActivity extends BaseActivity {
  type: 'follow';
  following_id: string;
  profiles: {
    full_name: string;
    profile_picture: string | null;
  };
}

type Activity = LikeActivity | SaveActivity | FollowActivity;

// Type guard function to check if an activity is valid
function isValidActivity(activity: any): activity is Activity {
  if (!activity || typeof activity !== 'object') return false;
  
  if (!activity.created_at || !activity.type) return false;
  
  if (activity.type === 'follow') {
    if (!activity.following_id) return false;
    // Check if profiles object exists and has required properties
    if (!activity.profiles || typeof activity.profiles !== 'object' || !('full_name' in activity.profiles)) {
      return false;
    }
  }
  
  if ((activity.type === 'like' || activity.type === 'save') && !activity.posts) {
    return false;
  }

  return true;
}

const HomeownerDashboard = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [followingArchitects, setFollowingArchitects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.userType !== 'homeowner') {
    return <Navigate to="/architect-dashboard" replace />;
  }
  
  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select(`
            *,
            homeowner_profiles(*)
          `)
          .eq('id', user.id)
          .single();
          
        if (profileError) throw profileError;
        
        const fetchActivity = async () => {
          const today = new Date();
          const thirtyDaysAgo = new Date(today);
          thirtyDaysAgo.setDate(today.getDate() - 30);
          
          // Fetch likes with proper join
          const { data: likesData } = await supabase
            .from('likes')
            .select(`
              created_at,
              posts(title, id, media_urls, architect_id)
            `)
            .eq('user_id', user.id)
            .gte('created_at', thirtyDaysAgo.toISOString())
            .limit(10);
            
          // Fetch saves with proper join  
          const { data: savesData } = await supabase
            .from('saved_posts')
            .select(`
              created_at,
              posts(title, id, media_urls, architect_id)
            `)
            .eq('user_id', user.id)
            .gte('created_at', thirtyDaysAgo.toISOString())
            .limit(10);
          
          // Fetch follows with explicit JOIN
          // Use a different approach for follows to fix the relationship issue
          const { data: followsData } = await supabase
            .from('follows')
            .select(`
              created_at,
              following_id
            `)
            .eq('follower_id', user.id)
            .gte('created_at', thirtyDaysAgo.toISOString())
            .limit(10);

          // Fetch profile data separately for follows
          const followsWithProfiles = await Promise.all(
            (followsData || []).map(async (follow) => {
              const { data: profileData } = await supabase
                .from('profiles')
                .select('full_name, profile_picture')
                .eq('id', follow.following_id)
                .single();
              
              return {
                ...follow,
                type: 'follow' as const,
                profiles: profileData || { full_name: 'Unknown User', profile_picture: null }
              };
            })
          );

          // Transform and validate data
          const likes: Activity[] = (likesData || [])
            .filter(item => item.posts)
            .map(item => ({ ...item, type: 'like' as const }));
          
          const saves: Activity[] = (savesData || [])
            .filter(item => item.posts)
            .map(item => ({ ...item, type: 'save' as const }));
          
          // Combine and filter out invalid activities
          const allActivity = [...likes, ...saves, ...followsWithProfiles]
            .filter(isValidActivity)
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          
          return allActivity.slice(0, 10);
        };
        
        const fetchFollowing = async () => {
          // Fetch follows first
          const { data: followsData, error: followsError } = await supabase
            .from('follows')
            .select('following_id')
            .eq('follower_id', user.id)
            .limit(5);
            
          if (followsError) throw followsError;
          
          // Then fetch profiles separately
          const following = await Promise.all(
            (followsData || []).map(async (follow) => {
              const { data: profileData } = await supabase
                .from('profiles')
                .select('full_name, profile_picture')
                .eq('id', follow.following_id)
                .single();
                
              return {
                following_id: follow.following_id,
                profiles: profileData || { full_name: 'Unknown User', profile_picture: null }
              };
            })
          );
          
          return following;
        };
        
        const [activity, following] = await Promise.all([
          fetchActivity(),
          fetchFollowing()
        ]);
        
        setProfileData(profile);
        setRecentActivity(activity);
        setFollowingArchitects(following);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfileData();
  }, [user?.id]);

  const formatActivityDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)} weeks ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="liked-posts" className="space-y-4">
            <TabsList className="grid grid-cols-3 w-full sm:w-auto">
              <TabsTrigger value="liked-posts" className="flex items-center gap-1">
                <HeartIcon className="h-4 w-4" /> 
                <span className="hidden sm:inline">Liked Posts</span>
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
                    <Button className="mt-4" asChild>
                      <Link to="/ai-generator">Launch AI Generator</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Spinner size="lg" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={profileData?.profile_picture} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">Homeowner</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="flex flex-col items-center p-2 border rounded-md">
                      <UsersIcon className="h-4 w-4 mb-1 text-muted-foreground" />
                      <span className="font-medium">{followingArchitects.length}</span>
                      <span className="text-xs text-muted-foreground">Following</span>
                    </div>
                    <div className="flex flex-col items-center p-2 border rounded-md">
                      <MessageSquare className="h-4 w-4 mb-1 text-muted-foreground" />
                      <span className="font-medium">0</span>
                      <span className="text-xs text-muted-foreground">Messages</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full" size="sm" asChild>
                    <Link to={`/profile/${user.id}`}>View Full Profile</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Spinner size="md" />
                </div>
              ) : recentActivity.length === 0 ? (
                <p className="text-center text-muted-foreground py-6 text-sm">
                  No recent activity yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={`${activity.type}-${index}`} className="flex items-start gap-2">
                      <div className="mt-0.5">
                        {activity.type === 'like' ? (
                          <HeartIcon className="h-4 w-4 text-red-500" />
                        ) : activity.type === 'save' ? (
                          <BookmarkIcon className="h-4 w-4 text-primary" />
                        ) : (
                          <UsersIcon className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      <div className="flex-1 text-sm">
                        <p>
                          {activity.type === 'like' ? (
                            <>You liked <Link to={`/design/${activity.posts.id}`} className="font-medium hover:underline">{activity.posts.title}</Link></>
                          ) : activity.type === 'save' ? (
                            <>You saved <Link to={`/design/${activity.posts.id}`} className="font-medium hover:underline">{activity.posts.title}</Link></>
                          ) : (
                            <>You followed <Link to={`/profile/${activity.following_id}`} className="font-medium hover:underline">{activity.profiles.full_name}</Link></>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatActivityDate(activity.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Architects You Follow</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Spinner size="md" />
                </div>
              ) : followingArchitects.length === 0 ? (
                <div className="text-center text-muted-foreground py-4 space-y-2">
                  <p>You're not following any architects yet.</p>
                  <Button size="sm" asChild variant="outline">
                    <Link to="/architects">Find Architects</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {followingArchitects.map((item, index) => (
                    <div key={item.following_id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={item.profiles.profile_picture} alt={item.profiles.full_name} />
                          <AvatarFallback>{item.profiles.full_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <Link to={`/profile/${item.following_id}`} className="text-sm font-medium hover:underline">
                          {item.profiles.full_name}
                        </Link>
                      </div>
                      <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                        <Link to={`/profile/${item.following_id}`}>
                          <MessageSquare className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                  
                  {followingArchitects.length > 0 && (
                    <Button size="sm" variant="ghost" className="w-full mt-2" asChild>
                      <Link to="/architects">View All Architects</Link>
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomeownerDashboard;
