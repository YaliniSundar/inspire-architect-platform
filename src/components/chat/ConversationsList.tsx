
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

interface ProfileData {
  id: string;
  full_name: string;
  profile_picture: string | null;
}

interface LastMessage {
  content: string;
  created_at: string;
}

interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
  homeowner_id: string;
  architect_id: string;
  status: string;
  profile: ProfileData;
  last_message?: LastMessage;
}

interface ConversationsListProps {
  onSelectConversation: (conversationId: string, recipientName: string, recipientAvatar?: string) => void;
  selectedConversationId?: string;
}

const ConversationsList = ({ onSelectConversation, selectedConversationId }: ConversationsListProps) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return;
      
      try {
        // Determine if the user is an architect or homeowner
        const isArchitect = user.userType === 'architect';
        const userIdField = isArchitect ? 'architect_id' : 'homeowner_id';
        const otherIdField = isArchitect ? 'homeowner_id' : 'architect_id';
        
        // Get all conversations for the current user
        const { data, error } = await supabase
          .from('conversations')
          .select(`
            *,
            ${otherIdField}_profile:profiles!${otherIdField}(id, full_name, profile_picture)
          `)
          .eq(userIdField, user.id);
        
        if (error) throw error;
        
        // Map the response to our expected format
        const mappedConversations = (data || []).map(conv => {
          // Rename the profile field for consistency with our interface
          const otherProfile = conv[`${otherIdField}_profile`];
          return {
            ...conv,
            profile: otherProfile
          };
        });
        
        // Fetch the last message for each conversation
        const conversationsWithLastMessage = await Promise.all(
          mappedConversations.map(async (conversation) => {
            const { data: messageData } = await supabase
              .from('messages')
              .select('content, created_at')
              .eq('conversation_id', conversation.id)
              .order('created_at', { ascending: false })
              .limit(1)
              .single();
              
            return {
              ...conversation,
              last_message: messageData || undefined
            };
          })
        );
        
        setConversations(conversationsWithLastMessage as Conversation[]);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchConversations();
    
    // Set up real-time listener for changes to conversations
    const channel = supabase
      .channel('public:conversations')
      .on('postgres_changes', { 
        event: 'INSERT',
        schema: 'public', 
        table: 'conversations',
        filter: user?.userType === 'architect' 
          ? `architect_id=eq.${user?.id}` 
          : `homeowner_id=eq.${user?.id}`
      }, () => {
        fetchConversations();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const filteredConversations = conversations.filter((conversation) =>
    conversation.profile.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    
    // If the message is from today, show time only
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If the message is from this week, show the day name
    const diff = (now.getTime() - date.getTime()) / (1000 * 3600 * 24);
    if (diff < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    
    // Otherwise show the date
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="h-full border rounded-lg flex flex-col">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Spinner size="lg" />
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            {searchTerm ? 'No conversations match your search' : 'No conversations yet'}
          </div>
        ) : (
          <ul className="divide-y">
            {filteredConversations.map((conversation) => (
              <li key={conversation.id}>
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start px-4 py-3 h-auto ${
                    selectedConversationId === conversation.id ? 'bg-secondary' : ''
                  }`}
                  onClick={() => onSelectConversation(
                    conversation.id, 
                    conversation.profile.full_name,
                    conversation.profile.profile_picture || undefined
                  )}
                >
                  <div className="flex items-start gap-3 w-full">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage src={conversation.profile.profile_picture || undefined} alt={conversation.profile.full_name} />
                      <AvatarFallback>{conversation.profile.full_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h4 className="font-medium truncate">{conversation.profile.full_name}</h4>
                        {conversation.last_message && (
                          <span className="text-xs text-muted-foreground flex-shrink-0">
                            {formatTimestamp(conversation.last_message.created_at)}
                          </span>
                        )}
                      </div>
                      
                      {conversation.last_message ? (
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.last_message.content}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">
                          Start a conversation
                        </p>
                      )}
                    </div>
                  </div>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ConversationsList;
