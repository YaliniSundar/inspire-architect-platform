
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { HeartIcon, BookmarkIcon, SparklesIcon, Settings2Icon } from "lucide-react";
import DesignNestLogo from '@/components/DesignNestLogo';

const HomeownerDashboard = () => {
  const { user } = useAuth();
  
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
  );
};

export default HomeownerDashboard;
