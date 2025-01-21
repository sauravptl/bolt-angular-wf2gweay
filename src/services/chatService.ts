import { API_ENDPOINTS } from '../config/api-endpoints';
import { API_KEYS } from '../config/api-keys';
import type { ChatMessage, ChatSettings } from '../types/chat';
import { GPT_MODELS } from '../config/gpt-models';

class ChatService {
  private currentSettings: ChatSettings;
  private messageHistory: { role: 'user' | 'assistant'; content: string }[] = [];

  constructor() {
    this.currentSettings = {
      model: 'mixtral-8x7b-32768',
      temperature: 0.7,
      responseLength: 'medium',
      tone: 'casual'
    };
  }

  private getApiConfig(modelId: string) {
    const model = GPT_MODELS.find(m => m.id === modelId);
    if (!model) {
      throw new Error('Invalid model selected');
    }

    switch (model.provider) {
      case 'groq':
        return {
          endpoint: API_ENDPOINTS.GROQ.CHAT,
          apiKey: API_KEYS.GROQ_API_KEY,
          headers: {
            'Authorization': `Bearer ${API_KEYS.GROQ_API_KEY}`
          }
        };
      case 'openai':
        return {
          endpoint: API_ENDPOINTS.OPENAI.CHAT,
          apiKey: API_KEYS.OPENAI_API_KEY,
          headers: {
            'Authorization': `Bearer ${API_KEYS.OPENAI_API_KEY}`
          }
        };
      default:
        throw new Error('Unsupported model provider');
    }
  }

  async sendMessage(text: string): Promise<string> {
    const apiConfig = this.getApiConfig(this.currentSettings.model);
    if (!apiConfig.apiKey) {
      throw new Error('API key is not configured for the selected model.');
    }

    try {
      // Update message history
      this.messageHistory.push({ role: 'user', content: text });

      const response = await fetch(apiConfig.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...apiConfig.headers
        },
        body: JSON.stringify({
          model: this.currentSettings.model,
          messages: this.messageHistory,
          temperature: this.currentSettings.temperature
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // Remove the failed message from history
        this.messageHistory.pop();
        
        const errorMessage = data.error?.message || 'Failed to get response from API';
        console.error('API Error:', { status: response.status, data });
        throw new Error(errorMessage);
      }

      const botResponse = data.choices?.[0]?.message?.content;
      if (!botResponse) {
        // Remove the failed message from history
        this.messageHistory.pop();
        throw new Error('No response received from API');
      }

      // Update message history with successful response
      this.messageHistory.push({ role: 'assistant', content: botResponse });
      return botResponse;

    } catch (error) {
      // Log the full error for debugging
      console.error('Chat service error:', {
        ...(error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        } : {
          error
        }),
        model: this.currentSettings.model
      });

      // If it's a network error, provide a more user-friendly message
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Network error. Please check your internet connection.');
      }

      throw error;
    }
  }

  async loadSessionMessages(): Promise<ChatMessage[]> {
    // Return empty array since we're not using Supabase
    return [];
  }

  setModel(modelId: string) {
    this.currentSettings.model = modelId;
  }

  updateSettings(settings: Partial<ChatSettings>) {
    this.currentSettings = { ...this.currentSettings, ...settings };
  }
}

export const chatService = new ChatService();