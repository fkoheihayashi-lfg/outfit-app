import { create } from 'zustand';
import { Item, ContextInput } from '../types';

// Session state is ephemeral — not persisted across restarts.
type SessionState = {
  selectedItem: Item | null;
  context: ContextInput | null;
  setSelectedItem: (item: Item | null) => void;
  setContext: (context: ContextInput | null) => void;
  reset: () => void;
};

export const useSessionStore = create<SessionState>()((set) => ({
  selectedItem: null,
  context: null,

  setSelectedItem: (selectedItem) => set({ selectedItem }),
  setContext: (context) => set({ context }),
  reset: () => set({ selectedItem: null, context: null }),
}));
