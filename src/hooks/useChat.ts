import { useState, useCallback, useEffect } from 'react';
import type { ChatMessage } from '../types/chat';
import { chatService } from '../services/chatService';
import { useChatStore } from '../stores/chatStore';

export function useChat() {
  const { currentSession, updateSession } = useChatStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load messages when session changes
  useEffect(() => {
    if (currentSession) {
      const loadMessages = async () => {
        const loadedMessages = await chatService.loadSessionMessages();
        setMessages(loadedMessages);
        updateSession({ messages: loadedMessages });
      };
      
      loadMessages().catch(error => {
        console.error('Error loading messages:', error);
      });
    } else {
      setMessages([]);
    }
  }, [currentSession?.id]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading || !currentSession) return;

    // Create user message
    const userMessage: ChatMessage = {
      text,
      isBot: false,
      timestamp: Date.now()
    };

    // Immediately update state with user message
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      // Send message to API
      const response = await chatService.sendMessage(text);
      
      // Create bot message
      const botMessage: ChatMessage = {
        text: response,
        isBot: true,
        timestamp: Date.now()
      };

      // Update state with bot response
      setMessages(prevMessages => {
        const newMessages = [...prevMessages, botMessage];
        updateSession({ messages: newMessages });
        return newMessages;
      });
    } catch (error) {
      // Log the full error object for debugging
      console.error('Error sending message:', {
        ...(error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        } : {
          error
        })
      });

      let errorMessage = 'An unexpected error occurred';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      // Add error message
      const errorChatMessage: ChatMessage = {
        text: `⚠️ ${errorMessage}. Please try again.`,
        isBot: true,
        timestamp: Date.now()
      };

      setMessages(prevMessages => {
        const newMessages = [...prevMessages, errorChatMessage];
        if (currentSession) {
          updateSession({ messages: newMessages });
        }
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, currentSession]);

  const clearChat = useCallback(() => {
    setMessages([]);
    if (currentSession) {
      updateSession({ messages: [] });
    }
  }, [currentSession]);

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat
  };
}