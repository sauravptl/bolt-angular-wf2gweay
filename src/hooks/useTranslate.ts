import { useState } from 'react';
import { translateService } from '../services/translateService';

export function useTranslate() {
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translate = async (text: string, targetLanguage: string) => {
    if (!text.trim() || !targetLanguage) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await translateService.translate(text, targetLanguage);
      setTranslatedText(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Translation failed');
      console.error('Translation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    translate,
    translatedText,
    isLoading,
    error
  };
}