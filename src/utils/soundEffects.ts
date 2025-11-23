/**
 * Sound effects utility for playing audio on user interactions
 */

class SoundEffects {
  private static instance: SoundEffects;
  private audioCache: Map<string, HTMLAudioElement> = new Map();
  private isEnabled: boolean = true;

  private constructor() {
    // Private constructor for singleton pattern
  }

  public static getInstance(): SoundEffects {
    if (!SoundEffects.instance) {
      SoundEffects.instance = new SoundEffects();
    }
    return SoundEffects.instance;
  }

  /**
   * Preload an audio file into cache
   */
  public preloadSound(name: string, url: string): void {
    if (this.audioCache.has(name)) {
      return;
    }

    const audio = new Audio(url);
    audio.preload = 'auto';
    audio.volume = 0.3; // Set a reasonable default volume
    
    audio.addEventListener('error', (e) => {
      console.error(`Failed to load sound '${name}':`, e);
    });
    
    this.audioCache.set(name, audio);
  }

  /**
   * Play a sound effect
   */
  public playSound(name: string, volume: number = 0.3): void {
    if (!this.isEnabled) {
      return;
    }

    const audio = this.audioCache.get(name);
    if (!audio) {
      console.warn(`Sound '${name}' not found in cache. Make sure to preload it first.`);
      return;
    }

    try {
      // Clone the audio to allow overlapping plays
      const audioClone = audio.cloneNode() as HTMLAudioElement;
      audioClone.volume = Math.min(Math.max(volume, 0), 1); // Clamp volume between 0 and 1
      
      // Reset to beginning and play
      audioClone.currentTime = 0;
      audioClone.play().catch(error => {
        // Silently handle autoplay policy errors
        console.debug('Audio play prevented by browser policy:', error);
      });
    } catch (error) {
      console.debug('Error playing sound:', error);
    }
  }

  /**
   * Enable or disable sound effects
   */
  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  /**
   * Check if sound effects are enabled
   */
  public isEnabledState(): boolean {
    return this.isEnabled;
  }

  /**
   * Set volume for a specific sound
   */
  public setVolume(name: string, volume: number): void {
    const audio = this.audioCache.get(name);
    if (audio) {
      audio.volume = Math.min(Math.max(volume, 0), 1);
    }
  }
}

// Export singleton instance
export const soundEffects = SoundEffects.getInstance();

// Preload common sounds
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready before preloading
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      soundEffects.preloadSound('menuclick', '/music/menuclick.mp3');
    });
  } else {
    soundEffects.preloadSound('menuclick', '/music/menuclick.mp3');
  }
}
