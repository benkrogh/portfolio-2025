import React, { useEffect, useRef, useState, useCallback } from "react";
import { SkipBack, Play, Pause, SkipForward, Expand, Minimize2, Info } from "lucide-react";
import { usePlayerStore } from '@/stores/playerStore';

interface Track {
  id: number;
  title: string;
  album: string;
  url: string;
}

interface AudioAnalyser {
  analyser: AnalyserNode;
  dataArray: Uint8Array;
}

const tracks: Track[] = [
  {
    id: 1,
    title: "700 Years",
    album: "Local Album",
    url: "/music/test-song.mp3",
  },
];

// Create a global audio context and persistent refs outside the component
let persistentAudioRef: HTMLAudioElement | null = null;
let persistentAudioContext: AudioContext | null = null;
let persistentSourceNode: MediaElementAudioSourceNode | null = null;
let persistentAnalyserNode: AnalyserNode | null = null;

const MusicPlayer = () => {
  const { 
    isExpanded, setIsExpanded, 
    isInitialized, setIsInitialized, 
    isVisible, setIsVisible,
    isPlaying, setIsPlaying,
    currentTime, setCurrentTime,
    isHydrated
  } = usePlayerStore();
  
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioAnalyser, setAudioAnalyser] = useState<AudioAnalyser | null>(
    null,
  );
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastScrollY = useRef(0);
  const isMounted = useRef(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number | null }>({ x: 0, y: null });
  const containerRef = useRef<HTMLDivElement>(null);

  // const formatTime = (time: number): string => {
  //   const minutes = Math.floor(time / 60);
  //   const seconds = Math.floor(time % 60);
  //   return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  // };

  const setupAudioAnalyser = useCallback(async () => {
    if (!audioRef.current) return;

    const initializeAudioContext = async () => {
      try {
        // Reuse existing audio context if available
        if (!persistentAudioContext) {
          persistentAudioContext = new (window.AudioContext ||
            (window as any).webkitAudioContext)();
        }

        // Only create new nodes if they don't exist
        if (!persistentSourceNode || !persistentAnalyserNode) {
          persistentSourceNode = persistentAudioContext.createMediaElementSource(
            audioRef.current!
          );
          persistentAnalyserNode = persistentAudioContext.createAnalyser();

          persistentAnalyserNode.fftSize = 256;
          persistentSourceNode.connect(persistentAnalyserNode);
          persistentAnalyserNode.connect(persistentAudioContext.destination);
        }

        const bufferLength = persistentAnalyserNode.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        setAudioAnalyser({ 
          analyser: persistentAnalyserNode, 
          dataArray 
        });
      } catch (error) {
        console.error("Error setting up audio analyser:", error);
      }
    };

    await initializeAudioContext();
  }, []);

  const animate = useCallback(() => {
    if (!canvasRef.current || !audioAnalyser) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      if (!audioAnalyser || !canvas || !ctx) return;

      animationFrameId.current = requestAnimationFrame(draw);

      const { width, height } = canvas;
      audioAnalyser.analyser.getByteFrequencyData(audioAnalyser.dataArray);

      // Calculate average frequency with increased sensitivity
      const average =
        audioAnalyser.dataArray.reduce((acc, val) => acc + val, 0) /
        audioAnalyser.dataArray.length;
      const normalizedIntensity = Math.pow(average / 255, 0.8); // Increased sensitivity with power function

      // Create dynamic gradient with more dramatic shifts
      const gradient = ctx.createLinearGradient(0, 0, width, height);

      // Increased hue shift range
      const hueShift = normalizedIntensity * 35; // Increased from 20 to 35

      // More dramatic color stops with higher saturation and larger ranges
      gradient.addColorStop(
        0,
        `hsla(12, 85%, ${55 + normalizedIntensity * 30}%, ${0.5 + normalizedIntensity * 0.4})`,
      );
      gradient.addColorStop(
        0.5,
        `hsla(${12 + hueShift}, 75%, ${50 + normalizedIntensity * 25}%, ${0.4 + normalizedIntensity * 0.3})`,
      );
      gradient.addColorStop(
        1,
        `hsla(20, 65%, ${45 + normalizedIntensity * 20}%, ${0.3 + normalizedIntensity * 0.4})`,
      );

      // Faster transitions with lower alpha
      ctx.globalAlpha = 0.6; // Reduced from 0.9 for faster changes

      // More transparent background for stronger effect
      ctx.fillStyle = "rgba(237, 233, 229, 0.08)"; // More transparent background
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    };

    draw();
  }, [audioAnalyser]);

  const initializeAudio = useCallback(async () => {
    // Use the persistent audio reference
    if (persistentAudioRef) {
      audioRef.current = persistentAudioRef;
      await setupAudioAnalyser();
      return persistentAudioRef;
    }
    
    const audio = new Audio(tracks[0].url);
    audio.preload = "auto";
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleError = (e: ErrorEvent) => {
      console.error("Audio error:", e);
      setIsPlaying(false);
    };
    const handleMetadata = () => {
      if (isMounted.current) {
        setDuration(audio.duration || 0);
        if (currentTime > 0) {
          audio.currentTime = currentTime;
        }
      }
    };

    // Set up all event listeners
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handlePause);
    audio.addEventListener("error", handleError);
    audio.addEventListener("loadedmetadata", handleMetadata);

    // Store cleanup function with the audio element
    audio.cleanup = () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handlePause);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("loadedmetadata", handleMetadata);
    };

    // Wait for audio to be loaded
    await new Promise((resolve) => {
      audio.addEventListener('loadeddata', resolve, { once: true });
    });

    audioRef.current = audio;
    persistentAudioRef = audio;
    await setupAudioAnalyser();
    return audio;
  }, [currentTime, setupAudioAnalyser]);

  useEffect(() => {
    if (!isHydrated) return;

    isMounted.current = true;
    
    // If we have a persistent audio reference, set up the analyser
    if (persistentAudioRef) {
      audioRef.current = persistentAudioRef;
      setupAudioAnalyser();
      
      // Update state based on current audio state
      setIsPlaying(!persistentAudioRef.paused);
      setIsInitialized(true);
      setCurrentTime(persistentAudioRef.currentTime);
      setDuration(persistentAudioRef.duration);
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      isMounted.current = false;
    };
  }, [isHydrated, setupAudioAnalyser]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (!audio || !isMounted.current) return;
      
      const currentTimeValue = audio.currentTime;
      const durationValue = audio.duration;
      
      if (isFinite(currentTimeValue) && isFinite(durationValue)) {
        setCurrentTime(currentTimeValue);
        const progressValue = (currentTimeValue / durationValue) * 100;
        setProgress(isFinite(progressValue) ? progressValue : 0);
      }
    };

    audio.addEventListener("timeupdate", updateProgress);
    
    // Also update progress when duration changes
    audio.addEventListener("durationchange", () => {
      setDuration(audio.duration);
      updateProgress();
    });

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("durationchange", updateProgress);
    };
  }, [setCurrentTime]);

  useEffect(() => {
    if (isPlaying) {
      animate();
    } else if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
  }, [isPlaying, animate]);

  useEffect(() => {
    if (canvasRef.current) {
      const resizeCanvas = () => {
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = canvas.offsetWidth;
          canvas.height = canvas.offsetHeight;
        }
      };

      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);
      return () => window.removeEventListener("resize", resizeCanvas);
    }
  }, []);

  const togglePlay = async () => {
    try {
      let audio = audioRef.current;
      
      if (!audio) {
        audio = await initializeAudio();
        if (!audio) return;
        setIsInitialized(true);
      }

      if (isPlaying) {
        audio.pause();
      } else {
        if (audio.currentTime >= audio.duration) {
          audio.currentTime = 0;
        }
        // Resume the audio context if it was suspended
        if (persistentAudioContext?.state === 'suspended') {
          await persistentAudioContext.resume();
        }
        await audio.play();
      }
    } catch (err) {
      console.error("Toggle play error:", err);
      setIsPlaying(false);
    }
  };

  const handleProgressClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !isFinite(audio.duration)) return;

    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const percentage = (e.clientX - rect.left) / rect.width;
    const newTime = percentage * audio.duration;

    if (isFinite(newTime)) {
      try {
        const wasPlaying = !audio.paused;
        
        // Set the new time
        audio.currentTime = newTime;
        setCurrentTime(newTime);
        setProgress(percentage * 100);

        // If it was playing, ensure it continues playing
        if (wasPlaying) {
          await audio.play();
        }
      } catch (error) {
        console.error("Error seeking audio:", error);
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (!isExpanded) {
        if (currentScrollY < lastScrollY.current || currentScrollY <= 0) {
          // Scrolling up or at top
          setIsVisible(true);
        } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
          // Scrolling down and past threshold
          setIsVisible(false);
        }
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isExpanded, setIsVisible]);

  useEffect(() => {
    if (containerRef.current) {
      const containerBounds = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: containerBounds.width / 2,
        y: null
      });
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const containerBounds = containerRef.current.getBoundingClientRect();
    const tooltipWidth = 300; // Adjust based on your content
    
    const xPos = e.clientX - containerBounds.left;
    const yPos = e.clientY - containerBounds.top;
    
    let finalX = xPos;
    if (xPos + tooltipWidth/2 > containerBounds.width) {
      finalX = containerBounds.width - tooltipWidth - 16;
    } else if (xPos - tooltipWidth/2 < 0) {
      finalX = tooltipWidth/2 + 16;
    }

    setMousePosition({ 
      x: finalX,
      y: yPos - 16 // Offset above the cursor
    });
  };

  const handleContainerClick = async (e: React.MouseEvent) => {
    // If not initialized, clicking anywhere should initialize and play
    if (!isInitialized) {
      e.stopPropagation();
      await togglePlay();
      return;
    }

    // If initialized but in minimized state, expand only if clicking the album art area
    if (!isExpanded) {
      const target = e.target as HTMLElement;
      const isAlbumArea = target.closest('.album-area');
      if (isAlbumArea) {
        setIsExpanded(true);
      }
    }
  };

  if (!isHydrated) {
    return null; // or a loading state if you prefer
  }

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onClick={handleContainerClick}
      className={`fixed 
        bottom-6 left-1/2 -translate-x-1/2
        transition-all duration-300 ease-in-out
        ${isExpanded 
          ? 'w-[1125px] px-6'
          : 'w-[400px]'
        }
        z-40
        ${!isVisible && !isExpanded ? 'translate-y-[150%]' : 'translate-y-0'}
      `}
    >
      <div
        style={{
          backgroundColor: "#EDE9E5",
          borderRadius: "24px",
          height: isExpanded ? "108px" : "72px",
        }}
        className="w-full relative overflow-hidden shadow-lg hover:shadow-xl 
          transition-all duration-300 ease-in-out"
      >
        {isExpanded && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(false);
            }}
            className="absolute top-4 right-4 z-10 p-2 rounded-lg hover:bg-black/10"
          >
            <Minimize2 className="w-5 h-5" />
          </button>
        )}

        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full opacity-75"
          style={{
            pointerEvents: "none",
            mixBlendMode: "soft-light",
            transition: "opacity 0.2s ease",
          }}
        />
        
        <div className="h-full flex flex-col">
          <div className={`absolute inset-x-0 ${isExpanded ? 'top-1/2 -translate-y-1/2 px-4 sm:px-8' : 'inset-y-0 px-4'}`}>
            <div className={`w-full h-full flex ${isExpanded ? 'sm:flex-row' : 'flex-row'} items-center gap-4 justify-between`}>
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className={`album-area ${
                  isExpanded ? 'w-16 h-16' : 'w-8 h-8'
                } rounded-lg flex-shrink-0 overflow-hidden relative bg-[#EC6A5C] group`}>
                  {!isInitialized ? (
                    <img
                      src="/images/placeholder-album.jpg"
                      alt="Music placeholder"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#EC6A5C]" />
                  )}
                  {isInitialized && !isExpanded && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsExpanded(true);
                      }}
                      className="absolute inset-0 bg-black/0 hover:bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center"
                    >
                      <Expand className="w-4 h-4 text-white" />
                    </button>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900 truncate max-w-[200px]">
                      {isInitialized ? tracks[0].title : "Care for some music?"}
                    </h3>
                    <div className="relative group" 
                      onMouseEnter={() => setTooltipVisible(true)}
                      onMouseLeave={() => setTooltipVisible(false)}
                    >
                      <Info 
                        className="w-4 h-4 text-gray-500 hover:text-gray-700 transition-colors cursor-help" 
                      />
                    </div>
                  </div>
                  {isExpanded && isInitialized && (
                    <p className="text-sm text-gray-500 truncate">{tracks[0].album}</p>
                  )}
                  {!isInitialized && (
                    <p className="text-sm text-gray-500">Click play to begin</p>
                  )}
                </div>
              </div>

              <div className={`${isExpanded ? 'flex-1 flex justify-center' : 'flex justify-end'}`}>
                <div className={`flex items-center ${isExpanded ? 'gap-8' : 'gap-4'}`}>
                  {isInitialized && (
                    <button className={`group relative flex items-center justify-center ${
                      isExpanded ? 'w-10 h-10' : 'w-8 h-8'
                    }`}>
                      <div className="absolute inset-0 bg-[#D6D2CB] rounded-[10px] transition-all duration-300 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100" />
                      <SkipBack className={`relative ${isExpanded ? 'w-5 h-5 sm:w-6 sm:h-6' : 'w-4 h-4'}`} />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlay();
                    }}
                    className={`group relative flex items-center justify-center ${
                      isExpanded ? 'w-[50px] h-[50px]' : 'w-8 h-8'
                    }`}
                  >
                    <div className="absolute inset-0 bg-[#D6D2CB] rounded-[10px] transition-all duration-300 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100" />
                    {isPlaying ? (
                      <Pause className={`relative ${isExpanded ? 'w-6 h-6 sm:w-[30px] sm:h-[30px]' : 'w-5 h-5'}`} />
                    ) : (
                      <Play className={`relative ${isExpanded ? 'w-6 h-6 sm:w-[30px] sm:h-[30px]' : 'w-5 h-5'}`} />
                    )}
                  </button>
                  {isInitialized && (
                    <button className={`group relative flex items-center justify-center ${
                      isExpanded ? 'w-10 h-10' : 'w-8 h-8'
                    }`}>
                      <div className="absolute inset-0 bg-[#D6D2CB] rounded-[10px] transition-all duration-300 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100" />
                      <SkipForward className={`relative ${isExpanded ? 'w-5 h-5 sm:w-6 sm:h-6' : 'w-4 h-4'}`} />
                    </button>
                  )}
                </div>
              </div>

              {isExpanded && <div className="flex-shrink-0 w-[100px]" />}
            </div>
          </div>
          
          {/* Progress bar */}
          {isInitialized && (
            <div
              className={`mt-auto h-1.5 sm:h-2 cursor-pointer ${
                isPlaying ? "bg-[#EC6A5C]/10" : ""
              }`}
              onClick={handleProgressClick}
            >
              <div
                className="h-full transition-all duration-200 bg-[#EC6A5C]"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </div>

      <div
        className="fixed bg-[#17120A] text-white rounded-xl py-3 px-4 text-sm w-[300px] z-50 transition-all duration-300 ease-out pointer-events-none"
        style={{
          left: `${mousePosition.x}px`,
          top: mousePosition.y ? `${mousePosition.y}px` : '0',
          transform: `translate(-50%, -100%) scale(${tooltipVisible ? 1 : 0.97})`,
          opacity: tooltipVisible && mousePosition.y !== null ? 1 : 0,
          visibility: tooltipVisible && mousePosition.y !== null ? 'visible' : 'hidden',
        }}
      >
        Enjoy this selection of songs I wrote and recorded in my home studio. ♥
      </div>
    </div>
  );
};

export default MusicPlayer;