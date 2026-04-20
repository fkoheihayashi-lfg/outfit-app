import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Outfit } from '../types';

type OutfitState = {
  savedOutfits: Outfit[];
  saveOutfit:   (outfit: Omit<Outfit, 'savedAt'>) => void;
  deleteOutfit: (savedAt: number) => void;
};

// Persisted data shape (functions are dropped by JSON serialisation).
type PersistedData = {
  savedOutfits?: Array<Record<string, unknown>>;
};

export const useOutfitStore = create<OutfitState>()(
  persist(
    (set) => ({
      savedOutfits: [],

      saveOutfit: (outfit) =>
        set((state) => ({
          savedOutfits: [
            ...state.savedOutfits,
            { ...outfit, savedAt: Date.now() },
          ],
        })),

      deleteOutfit: (savedAt) =>
        set((state) => ({
          savedOutfits: state.savedOutfits.filter((o) => o.savedAt !== savedAt),
        })),
    }),
    {
      name:    'outfits',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,

      // v0 → v1: 'label' was added to the Outfit type after initial release.
      // Any outfit persisted without a label gets a safe fallback so the
      // saved-screen badge never renders blank.
      migrate: (raw: unknown, version: number): OutfitState => {
        const data = raw as PersistedData;
        if (version < 1) {
          return {
            savedOutfits: (data.savedOutfits ?? []).map((o) => ({
              savedAt:    o.savedAt    as number,
              label:      (o.label    as string | undefined) ?? 'Saved',
              mainItem:   o.mainItem  as Outfit['mainItem'],
              otherItems: (o.otherItems as Outfit['otherItems']) ?? [],
              reason:     (o.reason   as string | undefined) ?? '',
            })),
            saveOutfit:   () => {},
            deleteOutfit: () => {},
          };
        }
        return raw as OutfitState;
      },
    }
  )
);
