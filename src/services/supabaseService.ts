
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

// Post interaction services
export const likePost = async (userId: string, postId: string) => {
  try {
    const { error } = await supabase
      .from('likes')
      .insert({
        user_id: userId,
        post_id: postId
      });
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error liking post:", error);
    return { success: false, error };
  }
};

export const unlikePost = async (userId: string, postId: string) => {
  try {
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('user_id', userId)
      .eq('post_id', postId);
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error unliking post:", error);
    return { success: false, error };
  }
};

export const savePost = async (userId: string, postId: string) => {
  try {
    const { error } = await supabase
      .from('saved_posts')
      .insert({
        user_id: userId,
        post_id: postId
      });
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error saving post:", error);
    return { success: false, error };
  }
};

export const unsavePost = async (userId: string, postId: string) => {
  try {
    const { error } = await supabase
      .from('saved_posts')
      .delete()
      .eq('user_id', userId)
      .eq('post_id', postId);
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error unsaving post:", error);
    return { success: false, error };
  }
};

// Profile functions
export const getProfile = async (userId: string) => {
  try {
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*, architect_profiles(*), homeowner_profiles(*)')
      .eq('id', userId)
      .maybeSingle();
    
    if (profileError) throw profileError;
    
    return { data: profileData, error: null };
  } catch (error: any) {
    console.error("Error fetching profile:", error);
    return { data: null, error };
  }
};

export const updateProfile = async (userId: string, updates: any) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select();
    
    if (error) throw error;
    
    toast({
      title: "Profile updated successfully",
    });
    
    return { data, error: null };
  } catch (error: any) {
    console.error("Error updating profile:", error);
    
    toast({
      title: "Profile update failed",
      description: error.message || "An error occurred during update.",
      variant: "destructive",
    });
    
    return { data: null, error };
  }
};

// Following system
export const followArchitect = async (followerId: string, architectId: string) => {
  try {
    // Check if already following
    const { data: existingFollow } = await supabase
      .from('follows')
      .select('*')
      .eq('follower_id', followerId)
      .eq('following_id', architectId)
      .maybeSingle();
      
    if (existingFollow) {
      return { success: true, error: null, message: "Already following" };
    }
    
    // Add follow record
    const { error } = await supabase
      .from('follows')
      .insert({
        follower_id: followerId,
        following_id: architectId
      });
    
    if (error) throw error;
    
    toast({
      title: "Followed successfully",
    });
    
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error following architect:", error);
    
    toast({
      title: "Action failed",
      description: error.message || "An error occurred.",
      variant: "destructive",
    });
    
    return { success: false, error };
  }
};

export const unfollowArchitect = async (followerId: string, architectId: string) => {
  try {
    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', architectId);
    
    if (error) throw error;
    
    toast({
      title: "Unfollowed successfully",
    });
    
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error unfollowing architect:", error);
    
    toast({
      title: "Action failed",
      description: error.message || "An error occurred.",
      variant: "destructive",
    });
    
    return { success: false, error };
  }
};

export const getFollowingList = async (userId: string) => {
  try {
    // First get the following IDs
    const { data: followingData, error: followingError } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', userId);
    
    if (followingError) throw followingError;
    
    if (!followingData || followingData.length === 0) {
      return { data: [], error: null };
    }
    
    // Then get the profile data for those IDs
    const followingIds = followingData.map(item => item.following_id);
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name, profile_picture, role')
      .in('id', followingIds);
    
    if (profilesError) throw profilesError;
    
    return { 
      data: profilesData?.map(item => ({
        id: item.id,
        name: item.full_name || '',
        avatarUrl: item.profile_picture || '',
        role: item.role || ''
      })) || [], 
      error: null 
    };
  } catch (error: any) {
    console.error("Error fetching following list:", error);
    return { data: [], error };
  }
};

export const getFollowersList = async (userId: string) => {
  try {
    // First get the follower IDs
    const { data: followerData, error: followerError } = await supabase
      .from('follows')
      .select('follower_id')
      .eq('following_id', userId);
    
    if (followerError) throw followerError;
    
    if (!followerData || followerData.length === 0) {
      return { data: [], error: null };
    }
    
    // Then get the profile data for those IDs
    const followerIds = followerData.map(item => item.follower_id);
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name, profile_picture, role')
      .in('id', followerIds);
    
    if (profilesError) throw profilesError;
    
    return { 
      data: profilesData?.map(item => ({
        id: item.id,
        name: item.full_name || '',
        avatarUrl: item.profile_picture || '',
        role: item.role || ''
      })) || [], 
      error: null 
    };
  } catch (error: any) {
    console.error("Error fetching followers list:", error);
    return { data: [], error };
  }
};

// Hiring system
export const hireArchitect = async (homeownerId: string, architectId: string, message: string = '') => {
  try {
    const { error } = await supabase
      .from('hiring_requests')
      .insert({
        homeowner_id: homeownerId,
        architect_id: architectId,
        message,
        status: 'pending'
      });
    
    if (error) throw error;
    
    toast({
      title: "Hire request sent",
      description: "The architect has been notified of your interest.",
    });
    
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error hiring architect:", error);
    
    toast({
      title: "Action failed",
      description: error.message || "An error occurred.",
      variant: "destructive",
    });
    
    return { success: false, error };
  }
};

export const getHiringStatus = async (homeownerId: string, architectId: string) => {
  try {
    const { data, error } = await supabase
      .from('hiring_requests')
      .select('status')
      .eq('homeowner_id', homeownerId)
      .eq('architect_id', architectId)
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (error) throw error;
    
    return { 
      status: data && data.length > 0 ? data[0].status : null,
      error: null 
    };
  } catch (error: any) {
    console.error("Error getting hiring status:", error);
    return { status: null, error };
  }
};
