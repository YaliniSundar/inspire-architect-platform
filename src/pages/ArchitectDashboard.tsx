
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageIcon, MessageSquareIcon, PlusCircle, Settings2Icon, UsersIcon, ChartBarIcon, Clock } from "lucide-react";
import DesignNestLogo from '@/components/DesignNestLogo';
import { supabase } from '@/integrations/supabase/client';
import { Spinner } from "@/components/ui/spinner";

const ArchitectDashboard = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [followers, setFollowers] = useState<any[]>([]);
  const [stats, setStats] = useState({
    designs: 0,
    views: 0,
    likes: 0,
    messages: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  
  // If user is not logged in or not an architect, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.userType !== 'architect') {
    return <Navigate to="/homeowner-dashboard" replace />;
  }

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch profile data
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select(`
            *,
            architect_profiles(*)
          `)
          .eq('id', user.id)
          .single();
          
        if (profileError) throw profileError;
        
        // Fetch followers
        const { data: followerData, error: followerError } = await supabase
          .from('follows')
          .select(`
            follower_id,
            profiles:profiles!follower_id(full_name, profile_picture)
          `)
          .eq('following_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (followerError) throw followerError;
        
        // Get count of designs
        const { count: designCount } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })
          .eq('architect_id', user.id);
          
        // Get count of unread messages
        const { data: conversations } = await supabase
          .from('conversations')
          .select('id')
          .eq('architect_id', user.id);
          
        const conversationIds = conversations?.map(c => c.id) || [];
        
        const { count: messageCount } = conversationIds.length > 0 ? 
          await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .neq('sender_id', user.id)
            .is('read_at', null)
            .in('conversation_id', conversationIds) : 
          { count: 0 };
          
        // Get pending hire requests
        const { data: requests, error: requestsError } = await supabase
          .from('hiring_requests')
          .select(`
            id,
            created_at,
            homeowner:profiles!homeowner_id(id, full_name, profile_picture)
          `)
          .eq('architect_id', user.id)
          .eq('status', 'pending')
          .order('created_at', { ascending: false });
          
        if (requestsError) throw requestsError;
        
        setProfileData(profile);
        setFollowers(followerData || []);
        setPendingRequests(requests || []);
        setStats({
          designs: designCount || 0,
          views: 0, // This would need a separate table to track views
          likes: 0, // You'd want to count likes on your designs
          messages: messageCount || 0
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user?.id]);
  
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
      
      {/* Dashboard overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <ImageIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Designs</p>
              <h3 className="text-2xl font-bold">
                {isLoading ? <Spinner size="sm" /> : stats.designs}
              </h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-blue-500/10 p-3 rounded-full">
              <UsersIcon className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Followers</p>
              <h3 className="text-2xl font-bold">
                {isLoading ? <Spinner size="sm" /> : followers.length}
              </h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-green-500/10 p-3 rounded-full">
              <MessageSquareIcon className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Messages</p>
              <h3 className="text-2xl font-bold">
                {isLoading ? <Spinner size="sm" /> : stats.messages}
              </h3>
              {stats.messages > 0 && (
                <Link to="/messages" className="text-xs text-primary underline">
                  View messages
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-amber-500/10 p-3 rounded-full">
              <Clock className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Requests</p>
              <h3 className="text-2xl font-bold">
                {isLoading ? <Spinner size="sm" /> : pendingRequests.length}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content area */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="portfolio" className="space-y-4">
            <TabsList className="grid grid-cols-2 w-full sm:w-auto">
              <TabsTrigger value="portfolio" className="flex items-center gap-1">
                <ImageIcon className="h-4 w-4" /> 
                <span className="hidden sm:inline">Portfolio</span>
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
            
            <TabsContent value="messages">
              <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                  <div>
                    <CardTitle>Client Messages</CardTitle>
                    <CardDescription>Inquiries and messages from potential clients.</CardDescription>
                  </div>
                  {stats.messages > 0 && (
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/messages">View All</Link>
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Spinner size="lg" />
                    </div>
                  ) : stats.messages === 0 ? (
                    <div className="py-10 text-center text-muted-foreground">
                      <p>You don't have any messages yet.</p>
                      <p>Messages from interested clients will appear here.</p>
                    </div>
                  ) : (
                    <Button asChild className="w-full">
                      <Link to="/messages">View {stats.messages} Unread Messages</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Pending requests section */}
          {pendingRequests.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Pending Hire Requests</CardTitle>
                <CardDescription>Homeowners interested in your services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={request.homeowner.profile_picture} alt={request.homeowner.full_name} />
                          <AvatarFallback>{request.homeowner.full_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{request.homeowner.full_name}</p>
                          <p className="text-xs text-muted-foreground">
                            Requested {new Date(request.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" asChild>
                        <Link to="/messages">
                          Respond
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* User profile card */}
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
                      <p className="text-sm text-muted-foreground">Architect</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="flex flex-col items-center p-2 border rounded-md">
                      <UsersIcon className="h-4 w-4 mb-1 text-muted-foreground" />
                      <span className="font-medium">{followers.length}</span>
                      <span className="text-xs text-muted-foreground">Followers</span>
                    </div>
                    <div className="flex flex-col items-center p-2 border rounded-md">
                      <ChartBarIcon className="h-4 w-4 mb-1 text-muted-foreground" />
                      <span className="font-medium">{stats.designs}</span>
                      <span className="text-xs text-muted-foreground">Designs</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full" size="sm" asChild>
                    <Link to={`/profile/${user.id}`}>View Public Profile</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Recent followers */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Recent Followers</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Spinner size="md" />
                </div>
              ) : followers.length === 0 ? (
                <p className="text-center text-muted-foreground py-6 text-sm">
                  No followers yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {followers.map((follower) => (
                    <div key={follower.follower_id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={follower.profiles.profile_picture} alt={follower.profiles.full_name} />
                          <AvatarFallback>{follower.profiles.full_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <Link to={`/profile/${follower.follower_id}`} className="text-sm font-medium hover:underline">
                          {follower.profiles.full_name}
                        </Link>
                      </div>
                      <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                        <Link to="/messages">
                          <MessageSquareIcon className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                  
                  {followers.length > 5 && (
                    <Button size="sm" variant="ghost" className="w-full mt-2" asChild>
                      <Link to={`/profile/${user.id}`}>View All Followers</Link>
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

export default ArchitectDashboard;
