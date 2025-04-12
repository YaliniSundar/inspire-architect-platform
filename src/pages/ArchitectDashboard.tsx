
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ImageIcon, MessageSquareIcon, PlusCircle, Settings2Icon } from "lucide-react";
import DesignNestLogo from '@/components/DesignNestLogo';

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
