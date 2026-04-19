import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Outfit } from '../types';

type OutfitState = {
  savedOutfits: Outfit[];
  saveOutfit: (outfit: Omit<Outfit, 'savedAt'>) => void;
  deleteOutfit: (savedAt: number) => void;
};

export const useOutfitStore = create<OutfitState>()(
  persist(
    (set) => ({
      savedOutfits: [],

      saveOutfit: (outfit) =>
        set((state) => ({
          savedOutfits: [...state.savedOutfits, { ...outfit, savedAt: Date.now() }],
        })),

      deleteOutfit: (savedAt) =>
        set((state) => ({
          savedOutfits: state.savedOutfits.filter((o) => o.savedAt !== savedAt),
        })),
    }),
    {
      name: 'outfits',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
