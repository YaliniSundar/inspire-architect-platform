
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from "react-hook-form";
import { UserIcon, ShieldIcon, LogOutIcon, AlertTriangleIcon, UsersIcon } from 'lucide-react';
import { updateProfile, getFollowingList, unfollowArchitect } from '@/services/supabaseService';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const SettingsPage = () => {
  const { user, logout, updateUserType, disableAccount } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [followingList, setFollowingList] = useState<any[]>([]);
  const [loadingFollowing, setLoadingFollowing] = useState(false);

  const form = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.profile?.phone || "",
    },
  });

  useEffect(() => {
    if (user) {
      fetchFollowing();
    }
  }, [user]);

  const fetchFollowing = async () => {
    if (!user) return;
    
    setLoadingFollowing(true);
    try {
      const { data } = await getFollowingList(user.id);
      setFollowingList(data || []);
    } catch (error) {
      console.error("Error fetching following list:", error);
    } finally {
      setLoadingFollowing(false);
    }
  };

  const handleUnfollow = async (architectId: string) => {
    if (!user) return;
    
    try {
      await unfollowArchitect(user.id, architectId);
      setFollowingList(prev => prev.filter(item => item.id !== architectId));
      toast({
        title: "Unfollowed successfully",
      });
    } catch (error) {
      console.error("Error unfollowing architect:", error);
      toast({
        title: "Action failed",
        description: "Could not unfollow. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="container py-16 text-center">
        <h2 className="text-2xl font-medium mb-2">You must be logged in to view settings</h2>
        <Button onClick={() => navigate('/login')} className="mt-4">
          Go to Login
        </Button>
      </div>
    );
  }

  const handleUserTypeChange = async () => {
    setIsLoading(true);
    try {
      const newType = user.userType === 'homeowner' ? 'architect' : 'homeowner';
      await updateUserType(newType);
      toast({
        title: "User type updated",
        description: `Your account has been updated to ${newType}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user type. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableAccount = async () => {
    setIsLoading(true);
    try {
      await disableAccount();
      toast({
        title: "Account disabled",
        description: "Your account has been disabled. You will be logged out.",
      });
      // Wait for toast to be visible
      setTimeout(() => {
        logout();
        navigate('/');
      }, 1500);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to disable account. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const onSubmit = async (values: any) => {
    setIsLoading(true);
    try {
      await updateProfile(user.id, {
        full_name: values.name,
        // Note: email cannot be updated directly in Supabase auth
        // Would need to use a special flow for that
        // For now just update in profile
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
      
      <Tabs defaultValue="profile" className="space-y-8">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <ShieldIcon className="h-4 w-4" />
            Account
          </TabsTrigger>
          <TabsTrigger value="following" className="flex items-center gap-2">
            <UsersIcon className="h-4 w-4" />
            Following
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Your email" type="email" {...field} readOnly />
                        </FormControl>
                        <FormDescription>
                          Email address cannot be changed directly. Contact support for help.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Your phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Account Type
              </CardTitle>
              <CardDescription>
                View your current account type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Current Account Type</Label>
                  <p className="text-sm text-muted-foreground capitalize">{user.userType}</p>
                </div>
                <Button variant="outline" disabled>
                  Cannot be changed
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldIcon className="h-5 w-5" />
                Account Preferences
              </CardTitle>
              <CardDescription>
                Manage your account preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Email Notifications</TableCell>
                    <TableCell>Receive email updates about your activity</TableCell>
                    <TableCell className="text-right">
                      <Switch defaultChecked id="email-notifications" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Marketing Communications</TableCell>
                    <TableCell>Receive promotional emails from Design Next</TableCell>
                    <TableCell className="text-right">
                      <Switch id="marketing-comm" />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangleIcon className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Actions that can't be undone
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between border rounded p-4">
                <div>
                  <h3 className="font-medium">Log out of all devices</h3>
                  <p className="text-sm text-muted-foreground">Logs you out from all browsers and devices</p>
                </div>
                <Button variant="outline">Log out everywhere</Button>
              </div>
              
              <div className="flex items-center justify-between border rounded p-4">
                <div>
                  <h3 className="font-medium">Disable account</h3>
                  <p className="text-sm text-muted-foreground">Temporarily disable your account</p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      Disable Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will disable your account and remove your access to the platform.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDisableAccount}
                        disabled={isLoading}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {isLoading ? "Processing..." : "Yes, disable my account"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="following" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UsersIcon className="h-5 w-5" />
                Following
              </CardTitle>
              <CardDescription>
                Architects you are following
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingFollowing ? (
                <div className="text-center py-8">
                  <p>Loading...</p>
                </div>
              ) : followingList.length > 0 ? (
                <div className="space-y-4">
                  {followingList.map((architect) => (
                    <div key={architect.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={architect.avatarUrl} alt={architect.name} />
                          <AvatarFallback>{architect.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{architect.name}</p>
                          <p className="text-sm text-muted-foreground capitalize">{architect.role}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/profile/${architect.id}`)}
                        >
                          View Profile
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleUnfollow(architect.id)}
                        >
                          Unfollow
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>You're not following any architects yet</p>
                  <p className="mt-1 text-sm">Follow architects to stay updated with their latest designs</p>
                  <Button 
                    onClick={() => navigate('/architects')}
                    variant="outline" 
                    className="mt-4"
                  >
                    Browse Architects
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UsersIcon className="h-5 w-5" />
                Followers
              </CardTitle>
              <CardDescription>
                People following you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>You don't have any followers yet</p>
                {user.userType === 'architect' ? (
                  <p className="mt-1 text-sm">Complete your profile and add designs to attract followers</p>
                ) : (
                  <p className="mt-1 text-sm">Share your saved designs to attract followers</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
