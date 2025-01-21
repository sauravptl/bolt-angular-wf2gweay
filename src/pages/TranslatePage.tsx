import { useState, useCallback } from 'react';
import { useTranslate } from '../hooks/useTranslate';
import { LoadingDots } from '../components/common/LoadingDots';

export default function TranslatePage() {
  const [sourceText, setSourceText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('');
  const { translate, translatedText, isLoading, error } = useTranslate();
  const [copied, setCopied] = useState(false);

  const languages = [
    { code: 'ar', name: 'Arabic' },
    { code: 'bn', name: 'Bengali' },
    { code: 'zh', name: 'Chinese (Simplified)' },
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'gu', name: 'Gujarati' },
    { code: 'hi', name: 'Hindi' },
    { code: 'id', name: 'Indonesian' },
    { code: 'it', name: 'Italian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'kn', name: 'Kannada' },
    { code: 'ko', name: 'Korean' },
    { code: 'ml', name: 'Malayalam' },
    { code: 'mr', name: 'Marathi' },
    { code: 'or', name: 'Odia' },
    { code: 'pa', name: 'Punjabi' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'sa', name: 'Sanskrit' },
    { code: 'es', name: 'Spanish' },
    { code: 'ta', name: 'Tamil' },
    { code: 'te', name: 'Telugu' },
    { code: 'tr', name: 'Turkish' },
    { code: 'ur', name: 'Urdu' },
    { code: 'vi', name: 'Vietnamese' }
  ].sort((a, b) => a.name.localeCompare(b.name));

  const handleTranslate = useCallback(async () => {
    if (!sourceText.trim() || !targetLanguage) return;
    const language = languages.find(l => l.code === targetLanguage);
    if (language) {
      try {
        await translate(sourceText, language.name);
      } catch (err) {
        console.error('Translation error:', err);
      }
    }
  }, [sourceText, targetLanguage, translate, languages]);

  const copyTranslation = useCallback(() => {
    if (translatedText) {
      navigator.clipboard.writeText(translatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [translatedText]);

  return (
    <div className="page-container">
      <div className="surface border-b border-facebook-light-secondary dark:border-facebook-dark-secondary">
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-facebook-light-text dark:text-facebook-dark-text">🔄 Translation</h2>
          <div className="flex items-center gap-4">
            <div className="text-sm text-facebook-light-text-secondary dark:text-facebook-dark-text-secondary">
              Characters: {sourceText.length}/5000
            </div>
            <button
              onClick={handleTranslate}
              disabled={!sourceText.trim() || !targetLanguage || isLoading}
              className="px-4 py-2 bg-facebook-light-primary dark:bg-facebook-dark-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {isLoading ? 'Translating...' : 'Translate'}
            </button>
          </div>
        </div>
      </div>

      <div className="content-area p-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Source Text Panel */}
            <div className="surface border border-facebook-light-secondary dark:border-facebook-dark-secondary rounded-lg flex flex-col h-[320px]">
              <div className="p-3 border-b border-facebook-light-secondary dark:border-facebook-dark-secondary flex justify-between items-center">
                <span className="font-medium">Source Text</span>
                <button 
                  onClick={() => setSourceText('')}
                  className="text-sm text-facebook-light-text-secondary dark:text-facebook-dark-text-secondary hover:text-facebook-light-primary dark:hover:text-facebook-dark-primary"
                >
                  Clear
                </button>
              </div>
              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="Enter text to translate..."
                className="flex-1 w-full p-3 bg-transparent text-facebook-light-text dark:text-facebook-dark-text focus:outline-none resize-none overflow-auto"
              />
            </div>

            {/* Target Language Panel */}
            <div className="surface border border-facebook-light-secondary dark:border-facebook-dark-secondary rounded-lg flex flex-col h-[320px]">
              <div className="p-3 border-b border-facebook-light-secondary dark:border-facebook-dark-secondary flex justify-between items-center">
                <div className="relative">
                  <select
                    value={targetLanguage}
                    onChange={(e) => setTargetLanguage(e.target.value)}
                    className="w-48 h-9 surface border border-facebook-light-secondary/20 dark:border-facebook-dark-secondary/20 text-facebook-light-text dark:text-facebook-dark-text rounded-lg px-3 pr-8 text-sm cursor-pointer focus:border-facebook-light-primary dark:focus:border-facebook-dark-primary appearance-none"
                  >
                    <option value="">Select language</option>
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-facebook-light-text-secondary dark:text-facebook-dark-text-secondary">
                    <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
                <button 
                  onClick={copyTranslation}
                  disabled={!translatedText}
                  className="text-sm text-facebook-light-text-secondary dark:text-facebook-dark-text-secondary hover:text-facebook-light-primary dark:hover:text-facebook-dark-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <div className="flex-1 relative">
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <LoadingDots />
                  </div>
                ) : (
                  <div className="w-full h-full p-3 text-facebook-light-text dark:text-facebook-dark-text whitespace-pre-wrap overflow-auto">
                    {translatedText || (
                      <span className="text-facebook-light-text-secondary dark:text-facebook-dark-text-secondary">
                        Translation will appear here...
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}