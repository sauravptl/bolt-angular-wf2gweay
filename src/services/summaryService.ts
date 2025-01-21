import { API_KEYS } from '../config/api-keys';
import { API_ENDPOINTS } from '../config/api-endpoints';
import { marked } from 'marked';

class SummaryService {
  private readonly systemPrompt = `
You are a professional document summarizer. Create a comprehensive summary with the following structure:

1. Executive Summary (2-3 sentences)
2. Main Themes & Key Takeaways
3. Supporting Details & Evidence
4. Conclusions & Recommendations

Use markdown formatting for better readability:
- Use ## for section headings
- Use bullet points for lists
- Use *italics* for emphasis on key terms
- Include brief explanations for technical terms in parentheses
- Maximum length: 1000 words
- Maintain a professional and objective tone`;

  async generateSummary(text: string): Promise<string> {
    try {
      if (!text.trim()) {
        throw new Error('No text content to summarize');
      }

      const response = await fetch(API_ENDPOINTS.OPENAI.CHAT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEYS.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo-16k',
          messages: [
            {
              role: 'system',
              content: this.systemPrompt
            },
            {
              role: 'user',
              content: text
            }
          ],
          temperature: 0.3,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to generate summary');
      }

      const data = await response.json();
      const summaryText = data.choices[0]?.message?.content;
      
      if (!summaryText) {
        throw new Error('No summary generated');
      }

      // Convert markdown to HTML
      return marked.parse(summaryText);
    } catch (error) {
      console.error('Summary generation error:', error);
      throw error;
    }
  }
}

export const summaryService = new SummaryService();