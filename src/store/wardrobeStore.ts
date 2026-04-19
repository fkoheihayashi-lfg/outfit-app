import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Item } from '../types';

type WardrobeState = {
  items: Item[];
  addItem: (item: Item) => void;
  deleteItem: (id: string) => void;
};

export const useWardrobeStore = create<WardrobeState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item) =>
        set((state) => ({ items: [...state.items, item] })),

      deleteItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
    }),
    {
      name: 'wardrobe',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
