import { create } from 'zustand';
import { GeneratedSession } from '../types';

export type SportLevel = 'débutant' | 'intermédiaire' | 'avancé';
export type MainGoal = 'perte de poids' | 'prise de masse' | 'mobilité';
export type Pathology = 'cardio-vasculaires' | 'articulaires' | 'hormonales';
export type Equipment = 'Poids du corps' | 'Haltères' | 'Kettlebell' | 'Élastique' | 'Barre' | 'Banc';

export interface UserProfile {
  // Physical Stats (requested in prompt, not in schema but needed for UX)
  weight?: string;
  height?: string;
  age?: string;

  // Schema Fields
  niveau_sportif: SportLevel | null;
  objectif_principal: MainGoal | null;
  pathologies_connues: Pathology[];
  limitations_physiques_actuelles: string[]; // Free text or specific list
  equipment_disponible: Equipment[];

  // Session Data
  currentSession: GeneratedSession | null;

  // Actions
  setField: <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => void;
  toggleArrayItem: <K extends keyof Pick<UserProfile, 'pathologies_connues' | 'equipment_disponible' | 'limitations_physiques_actuelles'>>(key: K, item: any) => void;
  setCurrentSession: (session: GeneratedSession | null) => void;
  reset: () => void;
}

export const useUserStore = create<UserProfile>((set) => ({
  weight: '',
  height: '',
  age: '',
  niveau_sportif: null,
  objectif_principal: null,
  pathologies_connues: [],
  limitations_physiques_actuelles: [],
  equipment_disponible: [],
  currentSession: null,

  setField: (key, value) => set((state) => ({ ...state, [key]: value })),

  toggleArrayItem: (key, item) => set((state) => {
    const currentArray = state[key] as any[];
    if (currentArray.includes(item)) {
      return { ...state, [key]: currentArray.filter((i) => i !== item) };
    } else {
      return { ...state, [key]: [...currentArray, item] };
    }
  }),

  setCurrentSession: (session) => set({ currentSession: session }),

  reset: () => set({
    weight: '',
    height: '',
    age: '',
    niveau_sportif: null,
    objectif_principal: null,
    pathologies_connues: [],
    limitations_physiques_actuelles: [],
    equipment_disponible: [],
    currentSession: null,
  }),
}));
