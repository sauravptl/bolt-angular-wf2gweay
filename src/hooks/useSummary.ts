import { useState } from 'react';
import { summaryService } from '../services/summaryService';

export function useSummary() {
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSummary = async (text: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await summaryService.generateSummary(text);
      setSummary(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate summary');
      console.error('Summary generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateSummary,
    summary,
    isLoading,
    error
  };
}