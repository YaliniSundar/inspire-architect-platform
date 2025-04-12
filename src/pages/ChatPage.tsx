
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ConversationsList from '@/components/chat/ConversationsList';
import ChatInterface from '@/components/chat/ChatInterface';
import { useAuth } from '@/contexts/AuthContext';
import { Separator } from "@/components/ui/separator";
import { MessageSquare } from 'lucide-react';

const ChatPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedConversation, setSelectedConversation] = useState<{
    id: string;
    recipientName: string;
    recipientAvatar?: string;
  } | null>(location.state?.conversation || null);
  
  if (!user) {
    navigate('/login', { replace: true });
    return null;
  }
  
  const handleSelectConversation = (
    conversationId: string,
    recipientName: string,
    recipientAvatar?: string
  ) => {
    setSelectedConversation({
      id: conversationId,
      recipientName,
      recipientAvatar
    });
  };

  return (
    <div className="container py-8">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Messages</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 h-[70vh]">
          <ConversationsList
            onSelectConversation={handleSelectConversation}
            selectedConversationId={selectedConversation?.id}
          />
        </div>
        
        <div className="md:col-span-2">
          {selectedConversation ? (
            <ChatInterface
              conversationId={selectedConversation.id}
              recipientName={selectedConversation.recipientName}
              recipientAvatar={selectedConversation.recipientAvatar}
            />
          ) : (
            <div className="border rounded-lg h-[70vh] flex flex-col items-center justify-center text-center p-8">
              <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No conversation selected</h3>
              <p className="text-muted-foreground">
                Select a conversation from the list to start messaging.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
