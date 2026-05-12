import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language, getDefaultLanguage } from './i18n';

export type EffectsIntensity = 'low' | 'medium' | 'high';

export interface SessionLogEntry {
  id: string;
  question: string;
  answer: string;
  timestamp: number;
}

export interface SavedStory {
  id: string;
  title: string;
  content: string;
  seed: string;
  style: string;
  length: string;
  language: Language;
  timestamp: number;
}

export interface ChallengeResult {
  questions: string[];
  answers: string[];
  timestamp: number;
  sign: string;
  phrase: string;
}

interface AppState {
  // Settings
  language: Language;
  audioEnabled: boolean;
  effectsIntensity: EffectsIntensity;
  reduceMotion: boolean;
  
  // Session
  sessionActive: boolean;
  sessionLog: SessionLogEntry[];
  
  // Stories
  savedStories: SavedStory[];
  
  // Challenge
  challengeMode: boolean;
  challengeQuestions: string[];
  challengeAnswers: string[];
  challengeResult: ChallengeResult | null;
  
  // Actions
  setLanguage: (lang: Language) => void;
  setAudioEnabled: (enabled: boolean) => void;
  setEffectsIntensity: (intensity: EffectsIntensity) => void;
  setReduceMotion: (reduce: boolean) => void;
  
  startSession: () => void;
  endSession: () => void;
  addSessionEntry: (question: string, answer: string) => void;
  clearSessionLog: () => void;
  
  saveStory: (story: Omit<SavedStory, 'id' | 'timestamp'>) => void;
  deleteStory: (id: string) => void;
  
  startChallenge: () => void;
  addChallengeEntry: (question: string, answer: string) => void;
  completeChallenge: () => void;
  resetChallenge: () => void;
  
  clearAllData: () => void;
}

const signs = ['☽', '◈', '✧', '⬡', '◇', '△', '○', '⚹'];

const finalPhrases = {
  it: [
    'Le ombre ricordano.',
    'Non tutto è rivelato.',
    'Il silenzio parla.',
    'Qualcuno ascoltava.',
    'La porta rimane socchiusa.',
  ],
  en: [
    'The shadows remember.',
    'Not all is revealed.',
    'Silence speaks.',
    'Someone was listening.',
    'The door remains ajar.',
  ],
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      language: getDefaultLanguage(),
      audioEnabled: false,
      effectsIntensity: 'medium',
      reduceMotion: false,
      sessionActive: false,
      sessionLog: [],
      savedStories: [],
      challengeMode: false,
      challengeQuestions: [],
      challengeAnswers: [],
      challengeResult: null,
      
      // Settings actions
      setLanguage: (lang) => set({ language: lang }),
      setAudioEnabled: (enabled) => set({ audioEnabled: enabled }),
      setEffectsIntensity: (intensity) => set({ effectsIntensity: intensity }),
      setReduceMotion: (reduce) => set({ reduceMotion: reduce }),
      
      // Session actions
      startSession: () => set({ sessionActive: true }),
      endSession: () => set({ sessionActive: false }),
      addSessionEntry: (question, answer) => set((state) => ({
        sessionLog: [
          ...state.sessionLog,
          {
            id: crypto.randomUUID(),
            question,
            answer,
            timestamp: Date.now(),
          },
        ],
      })),
      clearSessionLog: () => set({ sessionLog: [] }),
      
      // Story actions
      saveStory: (story) => set((state) => ({
        savedStories: [
          {
            ...story,
            id: crypto.randomUUID(),
            timestamp: Date.now(),
          },
          ...state.savedStories,
        ],
      })),
      deleteStory: (id) => set((state) => ({
        savedStories: state.savedStories.filter((s) => s.id !== id),
      })),
      
      // Challenge actions
      startChallenge: () => set({
        challengeMode: true,
        challengeQuestions: [],
        challengeAnswers: [],
        challengeResult: null,
      }),
      addChallengeEntry: (question, answer) => set((state) => ({
        challengeQuestions: [...state.challengeQuestions, question],
        challengeAnswers: [...state.challengeAnswers, answer],
      })),
      completeChallenge: () => {
        const state = get();
        const lang = state.language;
        const sign = signs[Math.floor(Math.random() * signs.length)];
        const phrases = finalPhrases[lang];
        const phrase = phrases[Math.floor(Math.random() * phrases.length)];
        
        set({
          challengeMode: false,
          challengeResult: {
            questions: state.challengeQuestions,
            answers: state.challengeAnswers,
            timestamp: Date.now(),
            sign,
            phrase,
          },
        });
      },
      resetChallenge: () => set({
        challengeMode: false,
        challengeQuestions: [],
        challengeAnswers: [],
        challengeResult: null,
      }),
      
      // Clear all
      clearAllData: () => set({
        sessionLog: [],
        savedStories: [],
        challengeQuestions: [],
        challengeAnswers: [],
        challengeResult: null,
      }),
    }),
    {
      name: 'nocturna-storage',
      version: 1,
      migrate: (persistedState, version) => {
        if (version === 0 || !persistedState) {
          return {
            ...persistedState,
            effectsIntensity: persistedState?.effectsIntensity ?? 'medium',
            reduceMotion: persistedState?.reduceMotion ?? false,
          };
        }
        return persistedState;
      },
    }
  )
);
