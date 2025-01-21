import { Database } from './supabase';

export interface GPTModel {
  id: string;
  name: string;
  description: string;
  isFree: boolean;
  provider: 'openai' | 'groq';
  pricing: {
    input: string;
    output: string;
  };
}

export interface ChatMessage {
  id?: string;
  text: string;
  isBot: boolean;
  timestamp: number;
  model?: string;
  attachments?: ChatAttachment[];
  metadata?: {
    tokens?: number;
    processingTime?: number;
    temperature?: number;
  };
}

export interface ChatAttachment {
  type: 'file';
  name: string;
  url: string;
  size: number;
  mimeType: string;
}

export interface ChatSettings {
  model: string;
  temperature: number;
  responseLength: 'short' | 'medium' | 'long';
  tone: 'formal' | 'casual';
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
  settings: ChatSettings;
}

export type ChatStore = {
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  settings: ChatSettings;
  createSession: () => ChatSession;
  updateSession: (session: Partial<ChatSession>) => void;
  deleteSession: (id: string) => void;
  setCurrentSession: (id: string) => void;
  updateSettings: (settings: Partial<ChatSettings>) => void;
};

export type Tables = Database['public']['Tables'];