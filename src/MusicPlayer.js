import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { SkipBack, Play, Pause, SkipForward } from 'lucide-react';

const PlayerContext = createContext(null);

const tracks = [
  { 
    id: 1, 
    title: "Sample Track", 
    album: "Test Album",
    url: "https://drive.google.com/uc?export=download&id=1IaOEPpaPTA2QjZe46MrHgrn2MNi4Wn6_"
  }
];

const MusicPlayer = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(new Audio(tracks[0].url));

  useEffect(() => {
    const audio = audioRef.current;
    
    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleTrackEnd = () => {
      setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleTrackEnd);
    
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleTrackEnd);
    };
  }, [currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    audio.src = tracks[currentTrackIndex].url;
    if (isPlaying) {
      audio.play().catch(error => console.error('Audio playback failed:', error));
    }
  }, [currentTrackIndex, isPlaying]);

  const contextValue = {
    currentTrack: tracks[currentTrackIndex],
    isPlaying,
    setIsPlaying,
    progress,
    audioRef,
    nextTrack: () => setCurrentTrackIndex((i) => (i + 1) % tracks.length),
    prevTrack: () => setCurrentTrackIndex((i) => (i - 1 + tracks.length) % tracks.length),
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      <div style={{ backgroundColor: '#EDE9E5', borderRadius: '32px' }} className="w-full max-w-3xl mx-auto relative overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <TrackInfo />
            <Controls />
          </div>
        </div>
        <ProgressBar />
      </div>
    </PlayerContext.Provider>
  );
};

const TrackInfo = () => {
  const { currentTrack } = useContext(PlayerContext);
  
  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-[#EC6A5C] rounded-md" />
      <div>
        <h3 className="font-medium text-gray-900">{currentTrack.title}</h3>
        <p className="text-sm text-gray-500">{currentTrack.album}</p>
      </div>
    </div>
  );
};

const Controls = () => {
  const { isPlaying, setIsPlaying, prevTrack, nextTrack, audioRef } = useContext(PlayerContext);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => console.error('Audio playback failed:', error));
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying]);

  return (
    <div className="flex items-center gap-4" role="group" aria-label="Playback controls">
      <button
        onClick={prevTrack}
        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
        aria-label="Previous track"
      >
        <SkipBack className="w-6 h-6" />
      </button>
      <button
        onClick={togglePlay}
        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <Pause className="w-6 h-6" />
        ) : (
          <Play className="w-6 h-6" />
        )}
      </button>
      <button
        onClick={nextTrack}
        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
        aria-label="Next track"
      >
        <SkipForward className="w-6 h-6" />
      </button>
    </div>
  );
};

const ProgressBar = () => {
  const { progress } = useContext(PlayerContext);
  
  return (
    <div className="h-8 bg-transparent w-full">
      <div 
        className="h-full transition-all duration-200" 
        style={{ 
          width: `${progress}%`,
          backgroundColor: '#A39F98'
        }}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin="0"
        aria-valuemax="100"
      />
    </div>
  );
};

export default MusicPlayer;