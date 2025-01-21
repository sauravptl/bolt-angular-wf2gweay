import { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { LoadingDots } from '../common/LoadingDots';
import type { ChatMessage as ChatMessageType } from '../../types/chat';

interface ChatMessageListProps {
  messages: ChatMessageType[];
  isLoading?: boolean;
}

export function ChatMessageList({ messages, isLoading = false }: ChatMessageListProps) {
  const messageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = messageContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  return (
    <div 
      ref={messageContainerRef} 
      className="h-full overflow-y-auto bg-facebook-light-background dark:bg-facebook-dark-background"
    >
      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className="space-y-6">
          {messages.length === 0 ? (
            <div className="text-center text-facebook-light-text-secondary dark:text-facebook-dark-text-secondary py-8">
              Start a conversation by typing a message below
            </div>
          ) : (
            messages.map((msg, index) => (
              <ChatMessage
                key={`${msg.timestamp}-${index}`}
                message={msg.text}
                isBot={msg.isBot}
                timestamp={msg.timestamp}
              />
            ))
          )}
          
          {isLoading && (
            <div className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-facebook-light-primary dark:bg-facebook-dark-primary flex items-center justify-center text-white">
                <span>🤖</span>
              </div>
              <div className="min-w-0 max-w-[70%]">
                <div className="inline-block px-4 py-3 rounded-lg bg-facebook-light-surface dark:bg-facebook-dark-surface border border-facebook-light-secondary/10 dark:border-facebook-dark-secondary/10">
                  <LoadingDots />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}