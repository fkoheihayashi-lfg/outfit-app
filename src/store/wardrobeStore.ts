import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Item } from '../types';
import { normalizeItem } from '../utils/normalize';

type WardrobeState = {
  items:      Item[];
  addItem:    (item: Item) => void;
  deleteItem: (id: string) => void;
};

export const useWardrobeStore = create<WardrobeState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item) =>
        set((state) => ({ items: [...state.items, normalizeItem(item)] })),

      deleteItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
    }),
    {
      name:    'wardrobe',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      // Item schema is unchanged from v0 — pass persisted state through as-is.
      migrate: (persistedState: unknown): WardrobeState =>
        persistedState as WardrobeState,
    }
  )
);
