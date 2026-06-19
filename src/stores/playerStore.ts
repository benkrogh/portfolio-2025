import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PlayerStore {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  isInitialized: boolean;
  setIsInitialized: (initialized: boolean) => void;
  hasStartedPlayback: boolean;
  setHasStartedPlayback: (started: boolean) => void;
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  currentTime: number;
  setCurrentTime: (time: number) => void;
  currentTrackIndex: number;
  setCurrentTrackIndex: (index: number) => void;
  isHydrated: boolean;
  setHydrated: (hydrated: boolean) => void;
}

const hasStoredState = () => {
  try {
    const stored = localStorage.getItem('music-player-storage');
    if (!stored) return false;

    const { state } = JSON.parse(stored);
    return state.hasStartedPlayback || state.currentTime > 0 || state.isPlaying;
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
      hasStartedPlayback: false,
      setHasStartedPlayback: (started) => set({ hasStartedPlayback: started }),
      isVisible: true,
      setIsVisible: (visible) => set({ isVisible: visible }),
      isPlaying: false,
      setIsPlaying: (playing) => set({ isPlaying: playing }),
      currentTime: 0,
      setCurrentTime: (time) => set({ currentTime: time }),
      currentTrackIndex: 0,
      setCurrentTrackIndex: (index) => set({ currentTrackIndex: index }),
      isHydrated: false,
      setHydrated: (hydrated) => set({ isHydrated: hydrated }),
    }),
    {
      name: 'music-player-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
        if (hasStoredState()) {
          state?.setHasStartedPlayback(true);
          state?.setIsInitialized(true);
        }
        // Browsers block autoplay; avoid UI/audio mismatch after reload
        state?.setIsPlaying(false);
      },
      partialize: (state) => ({
        isExpanded: state.isExpanded,
        isPlaying: state.isPlaying,
        currentTime: state.currentTime,
        currentTrackIndex: state.currentTrackIndex,
        hasStartedPlayback: state.hasStartedPlayback,
      }),
    }
  )
);
