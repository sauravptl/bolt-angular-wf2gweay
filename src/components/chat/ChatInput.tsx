import { useState, useRef, useEffect } from 'react';
import { ModelSelector } from './ModelSelector';

interface ChatInputProps {
  onSendMessage: (text: string) => Promise<void>;
  isLoading?: boolean;
}

export default function ChatInput({ onSendMessage, isLoading = false }: ChatInputProps) {
  const [inputText, setInputText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height
    textarea.style.height = 'auto';
    // Set new height
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  }, [inputText]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;
    
    const messageText = inputText;
    
    try {
      await onSendMessage(messageText);
      setInputText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="surface border-t border-facebook-light-secondary/20 dark:border-facebook-dark-secondary/20 p-4">
      <div className="max-w-3xl mx-auto flex flex-col gap-2">
        {/* Mobile: Model selector */}
        <div className="md:hidden">
          <ModelSelector />
        </div>

        {/* Input container */}
        <div className="flex flex-col md:flex-row w-full gap-2">
          <div className="flex-1 bg-facebook-light-background dark:bg-[#2D2E2F] border border-facebook-light-secondary/20 dark:border-facebook-dark-secondary/20 rounded-xl overflow-hidden transition-all duration-200 focus-within:border-facebook-light-primary dark:focus-within:border-facebook-dark-primary">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask me anything..."
              disabled={isLoading} 
              rows={1}
              className="w-full bg-transparent border-none text-facebook-light-text dark:text-facebook-dark-text placeholder-facebook-light-text-secondary/70 dark:placeholder-facebook-dark-text-secondary/70 focus:outline-none disabled:opacity-50 resize-none leading-6 p-3 min-h-[48px] overflow-y-auto scrollbar-none"
            />
          </div>

          {/* Desktop: Model selector and send button */}
          <div className="hidden md:flex items-center gap-2">
            <ModelSelector />
            <button 
              onClick={handleSend}
              disabled={isLoading || !inputText.trim()}
              className={`p-2.5 rounded-lg transition-colors ${
                (isLoading || !inputText.trim())
                  ? 'text-facebook-light-text-secondary/50 dark:text-facebook-dark-text-secondary/50 cursor-not-allowed'
                  : 'text-facebook-light-primary dark:text-facebook-dark-primary hover:bg-facebook-light-primary/10 dark:hover:bg-facebook-dark-primary/10 cursor-pointer'
              }`}
              title={isLoading ? 'Sending...' : 'Send message'}
            >
              <span className="block min-w-[24px] min-h-[24px] flex items-center justify-center">
                {isLoading ? '⏳' : '📤'}
              </span>
            </button>
          </div>

          {/* Mobile: Send button */}
          <div className="md:hidden">
            <button 
              onClick={handleSend}
              disabled={isLoading || !inputText.trim()}
              className={`w-full px-4 py-2 rounded-lg transition-colors ${
                (isLoading || !inputText.trim())
                  ? 'bg-facebook-light-secondary/30 dark:bg-facebook-dark-secondary/30 text-facebook-light-text-secondary/50 dark:text-facebook-dark-text-secondary/50 cursor-not-allowed'
                  : 'bg-facebook-light-primary dark:bg-facebook-dark-primary text-white hover:opacity-90'
              }`}
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>

        {/* Mobile keyboard spacer */}
        <div className="h-[env(keyboard-inset-height)] md:hidden" />
      </div>
    </div>
  );
}