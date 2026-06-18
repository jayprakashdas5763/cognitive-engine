import { create } from 'zustand';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface CognitiveState {
  goal: string;
  currentTask: string;
  thinking: string;
  tools: string[];
  confidence: number;
  progress: number;
}

export interface Store {
  messages: Message[];
  cognitive: CognitiveState;
  sidebarOpen: boolean;
  cognitiveOpen: boolean;

  addMessage: (message: Message) => void;
  setCognitive: (state: Partial<CognitiveState>) => void;
  toggleSidebar: () => void;
  toggleCognitive: () => void;
  reset: () => void;
}

const initialCognitive: CognitiveState = {
  goal: '',
  currentTask: '',
  thinking: '',
  tools: [],
  confidence: 0,
  progress: 0,
};

export const useStore = create<Store>((set) => ({
  messages: [],
  cognitive: initialCognitive,
  sidebarOpen: true,
  cognitiveOpen: true,

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  setCognitive: (newState) =>
    set((state) => ({
      cognitive: { ...state.cognitive, ...newState },
    })),

  toggleSidebar: () =>
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    })),

  toggleCognitive: () =>
    set((state) => ({
      cognitiveOpen: !state.cognitiveOpen,
    })),

  reset: () =>
    set({
      messages: [],
      cognitive: initialCognitive,
    }),
}));
