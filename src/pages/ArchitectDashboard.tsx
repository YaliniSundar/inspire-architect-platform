
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ImageIcon, UsersIcon, MessageSquareIcon, PlusCircle } from "lucide-react";

const ArchitectDashboard = () => {
  const { user } = useAuth();
  
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {user.name}!</h1>
          <p className="text-muted-foreground">
            Manage your portfolio, connect with clients, and showcase your designs.
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          <span>Upload Design</span>
        </Button>
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
              <div className="pb-4">
                <Link to="/architect-profile">
                  <Button variant="outline">Complete Your Profile</Button>
                </Link>
              </div>
              <div className="py-10 text-center text-muted-foreground">
                <p>You haven't uploaded any designs yet.</p>
                <p>Start building your portfolio by uploading your work!</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="followers">
          <Card>
            <CardHeader>
              <CardTitle>Your Followers</CardTitle>
              <CardDescription>Users who are following your work.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="py-10 text-center text-muted-foreground">
                <p>You don't have any followers yet.</p>
                <p>Complete your profile and upload designs to attract followers!</p>
              </div>
            </CardContent>
          </Card>
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
