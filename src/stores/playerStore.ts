import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PlayerStore {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  isInitialized: boolean;
  setIsInitialized: (initialized: boolean) => void;
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  currentTime: number;
  setCurrentTime: (time: number) => void;
  isHydrated: boolean;
  setHydrated: (hydrated: boolean) => void;
}

// Add a helper to check if there's stored state
const hasStoredState = () => {
  try {
    const stored = localStorage.getItem('music-player-storage');
    if (!stored) return false;
    
    const { state } = JSON.parse(stored);
    return state.currentTime > 0 || state.isPlaying;
  } catch {
    return false;
  }
};

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set) => ({
      isExpanded: false,
      setIsExpanded: (expanded) => set({ isExpanded: expanded }),
      isInitialized: false,
      setIsInitialized: (initialized) => set({ isInitialized: initialized }),
      isVisible: true,
      setIsVisible: (visible) => set({ isVisible: visible }),
      isPlaying: false,
      setIsPlaying: (playing) => set({ isPlaying: playing }),
      currentTime: 0,
      setCurrentTime: (time) => set({ currentTime: time }),
      isHydrated: false,
      setHydrated: (hydrated) => set({ isHydrated: hydrated }),
    }),
    {
      name: 'music-player-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
        // Only initialize if we have stored state
        if (hasStoredState()) {
          state?.setIsInitialized(true);
        }
      },
      partialize: (state) => ({
        isExpanded: state.isExpanded,
        isPlaying: state.isPlaying,
        currentTime: state.currentTime,
      }),
    }
  )
); 