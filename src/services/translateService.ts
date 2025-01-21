import { API_KEYS } from '../config/api-keys';
import { API_ENDPOINTS } from '../config/api-endpoints';

class TranslateService {
  async translate(text: string, targetLanguage: string): Promise<string> {
    try {
      if (!text.trim()) {
        throw new Error('Please enter text to translate');
      }

      if (!targetLanguage) {
        throw new Error('Please select a target language');
      }

      const response = await fetch(API_ENDPOINTS.OPENAI.CHAT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEYS.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a professional translator. Translate the following text to ${targetLanguage}. Maintain the original formatting and structure. Only provide the translation without any explanations or additional text.`
            },
            {
              role: 'user',
              content: text
            }
          ],
          temperature: 0.3
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Translation failed');
      }

      const data = await response.json();
      const translation = data.choices?.[0]?.message?.content;
      
      if (!translation) {
        throw new Error('No translation received');
      }

      return translation.trim();
    } catch (error) {
      console.error('Translation error:', error);
      throw error;
    }
  }
}

export const translateService = new TranslateService();