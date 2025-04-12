
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

// Types for chat operations
export interface CreateConversationParams {
  homeownerId: string;
  architectId: string;
  initialMessage?: string;
}

export interface ConversationData {
  id: string;
  recipientName: string;
  recipientAvatar?: string;
}

export const createConversation = async ({
  homeownerId,
  architectId,
  initialMessage
}: CreateConversationParams): Promise<ConversationData | null> => {
  try {
    // First check if a conversation already exists
    const { data: existingConversation, error: checkError } = await supabase
      .from('conversations')
      .select('id')
      .eq('homeowner_id', homeownerId)
      .eq('architect_id', architectId)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means no rows returned
      throw checkError;
    }
    
    let conversationId = existingConversation?.id;
    
    // If no conversation exists, create one
    if (!conversationId) {
      const { data: newConversation, error: createError } = await supabase
        .from('conversations')
        .insert({
          homeowner_id: homeownerId,
          architect_id: architectId,
          status: 'active'
        })
        .select('id')
        .single();
      
      if (createError) throw createError;
      
      conversationId = newConversation.id;
    }
    
    // Get the architect's details
    const { data: architectData, error: architectError } = await supabase
      .from('profiles')
      .select('full_name, profile_picture')
      .eq('id', architectId)
      .single();
    
    if (architectError) throw architectError;
    
    // Send the initial message if provided
    if (initialMessage && conversationId) {
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: homeownerId,
          content: initialMessage
        });
      
      if (messageError) throw messageError;
      
      // Create a notification for the architect
      await supabase
        .from('notifications')
        .insert({
          user_id: architectId,
          type: 'message',
          content: `You have a new message from a homeowner interested in your services.`,
          related_id: conversationId
        });
    }
    
    toast({
      title: "Conversation created",
      description: "You can now start messaging with the architect."
    });
    
    return {
      id: conversationId,
      recipientName: architectData.full_name,
      recipientAvatar: architectData.profile_picture || undefined
    };
  } catch (error: any) {
    console.error("Error creating conversation:", error);
    
    toast({
      title: "Failed to create conversation",
      description: error.message || "Please try again later.",
      variant: "destructive",
    });
    
    return null;
  }
};

export const getConversationById = async (conversationId: string): Promise<ConversationData | null> => {
  try {
    const { data: conversation, error } = await supabase
      .from('conversations')
      .select(`
        *,
        architect:profiles!architect_id(id, full_name, profile_picture),
        homeowner:profiles!homeowner_id(id, full_name, profile_picture)
      `)
      .eq('id', conversationId)
      .single();
    
    if (error) throw error;
    
    // Determine which profile to return based on the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("User not authenticated");
    
    const isHomeowner = user.id === conversation.homeowner_id;
    const profile = isHomeowner ? conversation.architect : conversation.homeowner;
    
    return {
      id: conversation.id,
      recipientName: profile.full_name,
      recipientAvatar: profile.profile_picture || undefined
    };
  } catch (error: any) {
    console.error("Error getting conversation:", error);
    return null;
  }
};

export const markConversationRead = async (conversationId: string, userId: string): Promise<void> => {
  try {
    await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .neq('sender_id', userId)
      .is('read_at', null);
  } catch (error) {
    console.error("Error marking conversation as read:", error);
  }
};

export const getUnreadMessagesCount = async (userId: string): Promise<number> => {
  try {
    // Get all conversations where the user is a participant
    const { data: conversations, error: convError } = await supabase
      .from('conversations')
      .select('id')
      .or(`homeowner_id.eq.${userId},architect_id.eq.${userId}`);
    
    if (convError) throw convError;
    
    if (!conversations || conversations.length === 0) return 0;
    
    // Get all unread messages from these conversations
    const { count, error: countError } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .neq('sender_id', userId)
      .is('read_at', null)
      .in('conversation_id', conversations.map(c => c.id));
    
    if (countError) throw countError;
    
    return count || 0;
  } catch (error) {
    console.error("Error getting unread messages count:", error);
    return 0;
  }
};
