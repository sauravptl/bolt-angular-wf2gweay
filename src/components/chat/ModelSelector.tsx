import { useState, useRef, useEffect } from 'react';
import { GPT_MODELS } from '../../config/gpt-models';
import { chatService } from '../../services/chatService';

export function ModelSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(GPT_MODELS[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleModelSelect = (model: typeof GPT_MODELS[0]) => {
    setSelectedModel(model);
    chatService.setModel(model.id);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full md:w-[180px] h-10 px-3 flex items-center justify-between gap-2 bg-facebook-light-background dark:bg-[#2D2E2F] border border-facebook-light-secondary/20 dark:border-facebook-dark-secondary/20 rounded-lg text-facebook-light-text dark:text-facebook-dark-text hover:border-facebook-light-primary dark:hover:border-facebook-dark-primary transition-colors"
      >
        <span className="truncate text-sm">{selectedModel.name}</span>
        <span className="text-xs opacity-70 transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-1 py-1 bg-facebook-light-background dark:bg-[#2D2E2F] border border-facebook-light-secondary/20 dark:border-facebook-dark-secondary/20 rounded-lg shadow-lg z-50 max-h-[300px] overflow-y-auto">
          {GPT_MODELS.map(model => (
            <button
              key={model.id}
              onClick={() => handleModelSelect(model)}
              className={`w-full px-3 py-2 text-left transition-colors ${
                selectedModel.id === model.id
                  ? 'bg-facebook-light-primary/10 dark:bg-facebook-dark-primary/20 text-facebook-light-primary dark:text-facebook-dark-primary'
                  : 'text-facebook-light-text dark:text-facebook-dark-text hover:bg-facebook-light-primary/5 dark:hover:bg-facebook-dark-primary/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{model.name}</span>
                <span className="text-xs text-facebook-light-text-secondary dark:text-facebook-dark-text-secondary/90">
                  {model.isFree ? 'Free' : 'Paid'}
                </span>
              </div>
              <p className="text-xs text-facebook-light-text-secondary dark:text-facebook-dark-text-secondary/90 mt-1">
                {model.description}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}