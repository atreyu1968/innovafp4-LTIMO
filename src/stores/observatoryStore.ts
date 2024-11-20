import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ObservationEntry, ObservatoryConfig, ObservationType } from '../types/observatory';
import { useAuthStore } from './authStore';
import { useNetworkStore } from './networkStore';
import { analyzeContent } from '../services/ai/aiService';

interface ObservatoryState {
  entries: ObservationEntry[];
  config: ObservatoryConfig;
  addEntry: (entry: Omit<ObservationEntry, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateEntry: (id: string, updates: Partial<ObservationEntry>) => void;
  deleteEntry: (id: string) => void;
  publishEntry: (id: string) => Promise<void>;
  rejectEntry: (id: string, notes: string) => void;
  updateConfig: (updates: Partial<ObservatoryConfig>) => void;
}

export const useObservatoryStore = create<ObservatoryState>()(
  persist(
    (set, get) => ({
      entries: [],
      config: {
        enabled: true,
        aiEnabled: false,
        autoPublish: false,
        moderators: [],
        promptTemplate: 'Analiza la siguiente innovación educativa y genera un resumen y tags relevantes.'
      },

      addEntry: async (entryData) => {
        const { config } = get();
        const now = new Date().toISOString();
        
        let aiContent, aiSummary, aiTags;
        
        if (config.aiEnabled) {
          try {
            const aiResult = await analyzeContent(
              entryData.title,
              entryData.description,
              entryData.type
            );
            
            aiContent = aiResult.content;
            aiSummary = aiResult.summary;
            aiTags = aiResult.tags;
          } catch (error) {
            console.error('Error al generar contenido con IA:', error);
          }
        }

        const newEntry: ObservationEntry = {
          id: crypto.randomUUID(),
          status: config.autoPublish ? 'published' : 'pending',
          createdAt: now,
          updatedAt: now,
          publishedAt: config.autoPublish ? now : undefined,
          ...entryData,
          aiContent,
          aiSummary,
          aiTags,
        };

        set(state => ({
          entries: [...state.entries, newEntry]
        }));
      },

      // ... resto del store sin cambios ...

    }),
    {
      name: 'observatory-storage',
    }
  )
);