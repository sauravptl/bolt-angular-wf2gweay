import { create } from 'zustand';
import { ChatStore, ChatSession, ChatSettings } from '../types/chat';

const DEFAULT_SETTINGS: ChatSettings = {
  model: 'gpt-3.5-turbo',
  temperature: 0.7,
  responseLength: 'medium',
  tone: 'casual'
};

// Create initial session
const createInitialSession = (): ChatSession => ({
  id: crypto.randomUUID(),
  title: 'New Chat',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  messages: [],
  settings: { ...DEFAULT_SETTINGS }
});

// Create initial state with default session
const initialSession = createInitialSession();
const initialState = {
  sessions: [initialSession],
  currentSession: null,
  settings: DEFAULT_SETTINGS,
};

export const useChatStore = create<ChatStore>((set) => ({
  ...initialState,

  createSession: () => {
    const newSession: ChatSession = {
      id: crypto.randomUUID(),
      title: `Chat ${new Date().toLocaleString()}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
      settings: { ...DEFAULT_SETTINGS }
    };

    set(state => ({
      sessions: [newSession, ...state.sessions],
      currentSession: newSession
    }));

    return newSession;
  },

  updateSession: (sessionUpdate) => {
    set(state => {
      const currentSession = state.currentSession;
      if (!currentSession) return state;

      const updatedSession = {
        ...currentSession,
        ...sessionUpdate,
        updatedAt: Date.now()
      };

      const updatedSessions = state.sessions.map(session =>
        session.id === currentSession.id ? updatedSession : session
      );

      return {
        sessions: updatedSessions,
        currentSession: updatedSession
      };
    });
  },

  deleteSession: (id) => {
    set(state => {
      const updatedSessions = state.sessions.filter(session => session.id !== id);
      // If no sessions left after delete, create a new one
      if (updatedSessions.length === 0) {
        const newSession = createInitialSession();
        updatedSessions.push(newSession);
      }
      return {
        sessions: updatedSessions,
        currentSession: state.currentSession?.id === id
          ? updatedSessions[0]
          : state.currentSession
      };
    });
  },

  setCurrentSession: (id) => {
    set(state => ({
      currentSession: state.sessions.find(session => session.id === id) || state.sessions[0]
    }));
  },

  updateSettings: (settingsUpdate) => {
    set(state => ({
      settings: { ...state.settings, ...settingsUpdate }
    }));
  }
}));