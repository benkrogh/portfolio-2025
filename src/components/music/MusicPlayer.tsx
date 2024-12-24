import React, { useEffect, useRef, useState, useCallback } from "react";
import { SkipBack, Play, Pause, SkipForward, Expand, Minimize2 } from "lucide-react";
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

  // const formatTime = (time: number): string => {
  //   const minutes = Math.floor(time / 60);
  //   const seconds = Math.floor(time % 60);
  //   return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  // };

  const setupAudioAnalyser = useCallback(() => {
    if (!audioRef.current || audioContextRef.current) return;

    const handleClick = () => {
      try {
        audioContextRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
        const source = audioContextRef.current.createMediaElementSource(
          audioRef.current!,
        );
        const analyser = audioContextRef.current.createAnalyser();

        analyser.fftSize = 256;
        source.connect(analyser);
        analyser.connect(audioContextRef.current.destination);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        setAudioAnalyser({ analyser, dataArray });

        document.removeEventListener("click", handleClick);
      } catch (error) {
        console.error("Error setting up audio analyser:", error);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
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

  useEffect(() => {
    if (!isHydrated) return;

    if (!audioRef.current && isInitialized) {
      audioRef.current = new Audio(tracks[0].url);
      audioRef.current.preload = "auto";

      audioRef.current.addEventListener("error", (e) => {
        console.error("Audio error:", e);
      });

      audioRef.current.addEventListener("loadedmetadata", () => {
        if (isMounted.current) {
          setDuration(audioRef.current?.duration || 0);
          // Restore playback position
          if (audioRef.current && currentTime > 0) {
            audioRef.current.currentTime = currentTime;
            if (isPlaying) {
              audioRef.current.play().catch(console.error);
            }
          }
        }
      });
    }

    isMounted.current = true;
    const cleanup = setupAudioAnalyser();

    return () => {
      cleanup?.();
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      isMounted.current = false;
    };
  }, [setupAudioAnalyser, currentTime, isPlaying, isHydrated, isInitialized]);

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
      if (!audioRef.current && !isInitialized) {
        audioRef.current = new Audio(tracks[0].url);
        audioRef.current.preload = "auto";
        setIsInitialized(true);
      }

      if (!audioRef.current) {
        console.error("Audio element not initialized");
        return;
      }

      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch((error) => {
              console.error("Playback failed:", error);
              setIsPlaying(false);
            });
        }
      }
    } catch (err) {
      console.error("Playback error:", err);
      setIsPlaying(false);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !isFinite(audioRef.current.duration)) return;

    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const progressBarWidth = rect.width;
    const percentage = clickPosition / progressBarWidth;
    const newTime = percentage * audioRef.current.duration;

    if (isFinite(newTime)) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      setProgress(percentage * 100);
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

  if (!isHydrated) {
    return null; // or a loading state if you prefer
  }

  return (
    <div 
      className={`fixed transition-all duration-300 ease-in-out ${
        isExpanded 
          ? 'bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[1200px] px-6'
          : 'bottom-6 left-1/2 -translate-x-1/2 w-[400px]'
      } z-40 ${!isVisible && !isExpanded ? 'translate-y-[150%]' : 'translate-y-0'}`}
    >
      <div
        style={{
          backgroundColor: "#EDE9E5",
          borderRadius: "24px",
          height: isExpanded ? "115px" : "72px",
        }}
        className="w-full relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
      >
        {isExpanded && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(false);
            }}
            className="absolute top-3 right-3 z-10 p-2 rounded-lg hover:bg-black/10"
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
          <div className={`absolute inset-x-0 ${isExpanded ? 'top-1/2 -translate-y-1/2 px-3 sm:px-6' : 'inset-y-0 px-4'}`}>
            <div className={`w-full h-full flex ${isExpanded ? 'sm:flex-row' : 'flex-row'} items-center gap-4 justify-between`}>
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className={`${isExpanded ? 'w-12 h-12' : 'w-8 h-8'} rounded-lg flex-shrink-0 overflow-hidden relative bg-[#EC6A5C] group`}>
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
                  <h3 className="font-medium text-gray-900 truncate max-w-[200px]">
                    {isInitialized ? tracks[0].title : "Care for some music?"}
                  </h3>
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
                      isExpanded ? 'w-[40px] h-[40px]' : 'w-8 h-8'
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

              {isExpanded && <div className="flex-shrink-0 w-[80px]" />}
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
    </div>
  );
};

export default MusicPlayer;
