import { GPTModel } from '../types/chat';

export const GPT_MODELS: GPTModel[] = [
  {
    id: 'mixtral-8x7b-32768',
    name: 'Mixtral 8x7B',
    description: 'High-performance model with 32k context window',
    isFree: true,
    provider: 'groq',
    pricing: {
      input: '$0.0005/1K tokens',
      output: '$0.0015/1K tokens'
    }
  },
  {
    id: 'gpt-4',
    name: 'GPT-3.5 Turbo',
    description: 'Most capable GPT-3.5 model, optimized for chat',
    isFree: true,
    provider: 'openai',
    pricing: {
      input: '$0.0005/1K tokens',
      output: '$0.0015/1K tokens'
    }
  },
  {
    id: 'gpt-4-turbo-preview',
    name: 'GPT-3.5 Turbo 16K',
    description: 'Same capabilities as standard GPT-3.5 but with 4x context length',
    isFree: true,
    provider: 'openai',
    pricing: {
      input: '$0.001/1K tokens',
      output: '$0.002/1K tokens'
    }
  }
];