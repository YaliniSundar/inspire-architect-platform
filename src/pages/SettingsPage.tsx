
import React, { useState } from 'react';
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
import { UserIcon, ShieldIcon, LogOutIcon, AlertTriangleIcon } from 'lucide-react';

const SettingsPage = () => {
  const { user, logout, updateUserType, disableAccount } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
      
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Profile Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Name</Label>
                  <p className="font-medium">{user.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Account Type</Label>
                  <p className="font-medium capitalize">{user.userType}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm" onClick={() => navigate(`/profile/${user.id}`)}>
                View Profile
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOutIcon className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldIcon className="h-5 w-5" />
                Account Preferences
              </CardTitle>
              <CardDescription>
                Manage your account type and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Account Type</TableCell>
                    <TableCell>Currently set as: <span className="font-medium capitalize">{user.userType}</span></TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline"
                        onClick={handleUserTypeChange}
                        disabled={isLoading}
                      >
                        Switch to {user.userType === 'homeowner' ? 'Architect' : 'Homeowner'}
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Email Notifications</TableCell>
                    <TableCell>Receive email updates about your activity</TableCell>
                    <TableCell className="text-right">
                      <Switch defaultChecked id="email-notifications" />
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
            <CardContent>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
