import { create } from 'zustand';
import type { User } from '../types/User';

interface StoreState {
  user: User | null;
  setUser: (user: User | null) => void;
}

const useStore = create<StoreState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

export default useStore;
