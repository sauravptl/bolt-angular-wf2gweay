import { useEffect } from 'react';
import { ChatMessageList } from '../components/chat/ChatMessageList';
import ChatInput from '../components/chat/ChatInput';
import { useChat } from '../hooks/useChat';
import { useChatStore } from '../stores/chatStore';
import { LoadingDots } from '../components/common/LoadingDots';

export default function ChatPage() {
  const { messages, isLoading, clearChat, sendMessage } = useChat();
  const { currentSession, createSession } = useChatStore();

  useEffect(() => {
    if (!currentSession) {
      createSession();
    }
  }, [currentSession, createSession]);

  if (!currentSession) {
    return (
      <div className="page-container">
        <div className="surface flex items-center justify-between p-4 border-b border-facebook-light-secondary dark:border-facebook-dark-secondary">
          <h2 className="text-2xl font-bold text-facebook-light-text dark:text-facebook-dark-text">💬 Chat</h2>
        </div>
        <div className="content-area flex items-center justify-center">
          <div className="flex items-center gap-2 text-facebook-light-text-secondary dark:text-facebook-dark-text-secondary">
            <LoadingDots />
            <span>Initializing chat...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="surface flex items-center justify-between p-4 border-b border-facebook-light-secondary dark:border-facebook-dark-secondary">
        <h2 className="text-2xl font-bold text-facebook-light-text dark:text-facebook-dark-text">💬 Chat</h2>
        <div 
          onClick={clearChat}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              clearChat();
            }
          }}
          className="px-3 py-1.5 text-sm text-facebook-light-text-secondary dark:text-facebook-dark-text-secondary hover:text-facebook-light-primary dark:hover:text-facebook-dark-primary cursor-pointer transition-colors"
        >
          Clear Chat
        </div>
      </div>
      <div className="content-area">
        <ChatMessageList 
          messages={messages}
          isLoading={isLoading}
        />
      </div>
      <ChatInput 
        onSendMessage={sendMessage}
        isLoading={isLoading}
      />
    </div>
  );
}