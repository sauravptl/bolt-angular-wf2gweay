import { memo } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown';

SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('markdown', markdown);

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  timestamp: number;
}

const renderer = new marked.Renderer();
renderer.code = (code, language) => {
  const validLanguage = language || 'text';
  return `<div class="code-block"><pre><code class="language-${validLanguage}">${code}</code></pre></div>`;
};

marked.setOptions({
  renderer,
  breaks: true,
  gfm: true
});

export const ChatMessage = memo(({ message, isBot, timestamp }: ChatMessageProps) => {
  const formattedTime = new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const parsedMarkdown = marked.parse(message).toString();
  const sanitizedHtml = DOMPurify.sanitize(parsedMarkdown);

  return (
    <div className={`flex gap-3 items-start ${!isBot && 'justify-end'}`}>
      {isBot && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-facebook-light-primary dark:bg-facebook-dark-primary flex items-center justify-center text-white">
          <span>🤖</span>
        </div>
      )}
      <div className={`min-w-0 max-w-[70%] ${!isBot && 'order-1'}`}>
        <div 
          className={`inline-block rounded-lg border ${
            isBot 
              ? 'bg-facebook-light-surface dark:bg-[#2D2E2F] border-facebook-light-secondary/10 dark:border-facebook-dark-secondary/10' 
              : 'bg-facebook-light-primary dark:bg-facebook-dark-primary border-transparent text-white'
          }`}
        >
          <div 
            className="prose prose-sm dark:prose-invert max-w-none p-3 break-words"
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }} 
          />
        </div>
        <div className="text-xs text-facebook-light-text-secondary dark:text-facebook-dark-text-secondary/90 mt-1 px-1">
          {formattedTime}
        </div>
      </div>
      {!isBot && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
          👤
        </div>
      )}
    </div>
  );
});