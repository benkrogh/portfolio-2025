import React, { useEffect, useRef, useState, useCallback } from "react";
import { SkipBack, Play, Pause, SkipForward, Expand, Minimize2, Info } from "lucide-react";
import { usePlayerStore } from '@/stores/playerStore';

interface Track {
  id: number;
  title: string;
  album: string;
  url: string;
  artwork: string;
}

interface AudioAnalyser {
  analyser: AnalyserNode;
  /** Typed for `AnalyserNode.getByteFrequencyData` (requires ArrayBuffer-backed storage). */
  dataArray: Uint8Array<ArrayBuffer>;
}

const tracks: Track[] = [
  {
    id: 1,
    title: "700 Years",
    album: "Patchwork",
    url: "/music/700-years.mp3",
    artwork: "/images/music/700years.jpg",
  },
  {
    id: 2,
    title: "Quigley",
    album: "Three Wayne May",
    url: "/music/Quigley.mp3",
    artwork: "/images/music/Quigley.jpg",
  },
  {
    id: 3,
    title: "Things People Say",
    album: "Things People Say",
    url: "/music/thingspeoplesay.mp3",
    artwork: "/images/music/thingspeoplesay.jpg",
  },
];

let persistentAudioRef: HTMLAudioElement | null = null;
let persistentAudioContext: AudioContext | null = null;
let persistentSourceNode: MediaElementAudioSourceNode | null = null;
let persistentAnalyserNode: AnalyserNode | null = null;
let audioListenersAttached = false;
let isComponentMounted = false;

let updateProgressUI: ((currentTime: number, duration: number) => void) | null = null;

const waitForMetadata = (audio: HTMLAudioElement): Promise<void> => {
  if (isFinite(audio.duration) && audio.duration > 0) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const onMetadata = () => {
      audio.removeEventListener("loadedmetadata", onMetadata);
      resolve();
    };
    audio.addEventListener("loadedmetadata", onMetadata);
  });
};

const attachAudioListeners = (audio: HTMLAudioElement) => {
  if (audioListenersAttached) return;
  audioListenersAttached = true;

  const updateProgress = () => {
    if (!isComponentMounted) return;

    const { currentTime, duration } = audio;
    if (!isFinite(duration) || duration <= 0) return;

    usePlayerStore.getState().setCurrentTime(currentTime);
    updateProgressUI?.(currentTime, duration);
  };

  const handleDurationChange = () => {
    if (!isComponentMounted) return;
    updateProgressUI?.(audio.currentTime, audio.duration);
    updateProgress();
  };

  audio.addEventListener("play", () => {
    usePlayerStore.getState().setIsPlaying(true);
  });

  audio.addEventListener("pause", () => {
    usePlayerStore.getState().setIsPlaying(false);
  });

  audio.addEventListener("ended", () => {
    const { setIsPlaying, setCurrentTime } = usePlayerStore.getState();
    setIsPlaying(false);
    if (isFinite(audio.duration)) {
      setCurrentTime(audio.duration);
      updateProgressUI?.(audio.duration, audio.duration);
    }
  });

  audio.addEventListener("error", (e) => {
    console.error("Audio error:", e);
    usePlayerStore.getState().setIsPlaying(false);
  });

  audio.addEventListener("timeupdate", updateProgress);
  audio.addEventListener("durationchange", handleDurationChange);
};

const MusicPlayer = () => {
  const {
    isExpanded, setIsExpanded,
    isInitialized, setIsInitialized,
    isVisible, setIsVisible,
    isPlaying, setIsPlaying,
    currentTrackIndex,
    isHydrated
  } = usePlayerStore();

  const showWelcome = !isHydrated || !isInitialized;

  const [progress, setProgress] = useState(0);
  const [, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioAnalyser, setAudioAnalyser] = useState<AudioAnalyser | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number>();
  const lastScrollY = useRef(0);
  const isMounted = useRef(false);
  const sessionRestored = useRef(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number | null }>({ x: 0, y: null });
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const isScrubbingRef = useRef(false);

  const syncProgressUI = useCallback((currentTime: number, duration: number) => {
    setDuration(duration);
    setProgress(duration > 0 ? (currentTime / duration) * 100 : 0);
  }, []);

  const setupAudioAnalyser = useCallback(async () => {
    if (!audioRef.current) return;

    try {
      if (!persistentAudioContext) {
        const AC =
          window.AudioContext ||
          (window as Window & { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext;
        if (!AC) return;
        persistentAudioContext = new AC();
      }

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
      const dataArray = new Uint8Array(new ArrayBuffer(bufferLength));

      setAudioAnalyser({
        analyser: persistentAnalyserNode,
        dataArray
      });
    } catch (error) {
      console.error("Error setting up audio analyser:", error);
    }
  }, []);

  const ensureAudio = useCallback(async (): Promise<HTMLAudioElement> => {
    if (persistentAudioRef) {
      audioRef.current = persistentAudioRef;
      attachAudioListeners(persistentAudioRef);
      await setupAudioAnalyser();
      return persistentAudioRef;
    }

    const trackIndex = usePlayerStore.getState().currentTrackIndex;
    const audio = new Audio(tracks[trackIndex].url);
    audio.preload = "auto";

    attachAudioListeners(audio);
    audioRef.current = audio;
    persistentAudioRef = audio;
    await setupAudioAnalyser();
    return audio;
  }, [setupAudioAnalyser]);

  const syncPlayerAfterNavigation = useCallback(async () => {
    isMounted.current = true;
    isComponentMounted = true;
    updateProgressUI = syncProgressUI;

    if (persistentAudioRef) {
      audioRef.current = persistentAudioRef;
      attachAudioListeners(persistentAudioRef);
      await setupAudioAnalyser();
      await waitForMetadata(persistentAudioRef);
      syncProgressUI(persistentAudioRef.currentTime, persistentAudioRef.duration);
      setIsPlaying(!persistentAudioRef.paused);
      if (usePlayerStore.getState().hasStartedPlayback) {
        setIsInitialized(true);
      }
    }

    if (canvasRef.current) {
      canvasRef.current.width = canvasRef.current.offsetWidth;
      canvasRef.current.height = canvasRef.current.offsetHeight;
    }
  }, [setupAudioAnalyser, syncProgressUI, setIsPlaying]);

  const loadTrack = useCallback(async (
    index: number,
    { autoplay = false, startTime = 0 }: { autoplay?: boolean; startTime?: number } = {}
  ) => {
    const audio = await ensureAudio();
    const { setCurrentTrackIndex, setCurrentTime } = usePlayerStore.getState();

    setCurrentTrackIndex(index);
    audio.pause();
    audio.src = tracks[index].url;
    audio.load();
    await waitForMetadata(audio);

    const duration = audio.duration;
    const clampedTime = Math.max(0, Math.min(startTime, duration));
    audio.currentTime = clampedTime;

    setCurrentTime(clampedTime);
    syncProgressUI(clampedTime, duration);
    usePlayerStore.getState().setHasStartedPlayback(true);
    setIsInitialized(true);

    if (autoplay) {
      if (persistentAudioContext?.state === "suspended") {
        await persistentAudioContext.resume();
      }
      await audio.play();
    }
  }, [ensureAudio, syncProgressUI, setIsInitialized]);

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

      const average =
        audioAnalyser.dataArray.reduce((acc, val) => acc + val, 0) /
        audioAnalyser.dataArray.length;
      const normalizedIntensity = Math.pow(average / 255, 0.8);

      const gradient = ctx.createLinearGradient(0, 0, width, height);
      const hueShift = normalizedIntensity * 35;

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

      ctx.globalAlpha = 0.6;
      ctx.fillStyle = "rgba(237, 233, 229, 0.08)";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    };

    draw();
  }, [audioAnalyser]);

  useEffect(() => {
    if (!isHydrated) return;

    isMounted.current = true;
    isComponentMounted = true;
    updateProgressUI = syncProgressUI;

    const restoreSession = async () => {
      if (sessionRestored.current) return;
      sessionRestored.current = true;

      if (persistentAudioRef) {
        audioRef.current = persistentAudioRef;
        attachAudioListeners(persistentAudioRef);
        await setupAudioAnalyser();

        const audio = persistentAudioRef;
        await waitForMetadata(audio);
        syncProgressUI(audio.currentTime, audio.duration);
        setIsPlaying(!audio.paused);
        if (usePlayerStore.getState().hasStartedPlayback) {
          setIsInitialized(true);
        }
        return;
      }

      if (isInitialized) {
        const { currentTrackIndex: storedIndex, currentTime: storedTime } = usePlayerStore.getState();
        await loadTrack(storedIndex, { autoplay: false, startTime: storedTime });
      }
    };

    restoreSession();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      isMounted.current = false;
      isComponentMounted = false;
      updateProgressUI = null;
    };
  }, [isHydrated, isInitialized, setupAudioAnalyser, syncProgressUI, loadTrack, setIsPlaying]);

  useEffect(() => {
    const handleNavigation = () => {
      void syncPlayerAfterNavigation();
    };

    document.addEventListener("astro:page-load", handleNavigation);
    document.addEventListener("astro:after-swap", handleNavigation);

    return () => {
      document.removeEventListener("astro:page-load", handleNavigation);
      document.removeEventListener("astro:after-swap", handleNavigation);
    };
  }, [syncPlayerAfterNavigation]);

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
      let audio = audioRef.current ?? persistentAudioRef;

      if (!audio) {
        audio = await ensureAudio();
        await waitForMetadata(audio);
        setIsInitialized(true);
      } else {
        audioRef.current = audio;
      }

      if (isPlaying) {
        audio.pause();
      } else {
        usePlayerStore.getState().setHasStartedPlayback(true);
        setIsInitialized(true);

        await waitForMetadata(audio);

        if (isFinite(audio.duration) && audio.duration > 0 && audio.currentTime >= audio.duration) {
          audio.currentTime = 0;
          usePlayerStore.getState().setCurrentTime(0);
          syncProgressUI(0, audio.duration);
        }

        if (persistentAudioContext?.state === "suspended") {
          await persistentAudioContext.resume();
        }
        await audio.play();
      }
    } catch (err) {
      console.error("Toggle play error:", err);
      setIsPlaying(false);
    }
  };

  const seekToClientX = useCallback(async (clientX: number, options?: { resumePlayback?: boolean }) => {
    try {
      let audio = audioRef.current ?? persistentAudioRef;

      if (!audio) {
        audio = await ensureAudio();
        await waitForMetadata(audio);
        setIsInitialized(true);
      } else {
        audioRef.current = audio;
      }

      await waitForMetadata(audio);
      if (!isFinite(audio.duration) || audio.duration <= 0) return;

      const track = progressBarRef.current;
      if (!track) return;

      const rect = track.getBoundingClientRect();
      if (rect.width <= 0) return;

      const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const newTime = percentage * audio.duration;
      const shouldResume = options?.resumePlayback ?? !audio.paused;

      audio.currentTime = newTime;
      usePlayerStore.getState().setCurrentTime(newTime);
      syncProgressUI(newTime, audio.duration);

      if (shouldResume) {
        if (persistentAudioContext?.state === "suspended") {
          await persistentAudioContext.resume();
        }
        if (audio.paused) {
          await audio.play();
        }
      }
    } catch (error) {
      console.error("Error seeking audio:", error);
    }
  }, [ensureAudio, setIsInitialized, syncProgressUI]);

  const wasPlayingBeforeScrubRef = useRef(false);

  const handleProgressPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    isScrubbingRef.current = true;
    wasPlayingBeforeScrubRef.current = !audioRef.current?.paused;
    if (wasPlayingBeforeScrubRef.current) {
      audioRef.current?.pause();
    }
    e.currentTarget.setPointerCapture(e.pointerId);
    void seekToClientX(e.clientX, { resumePlayback: false });
  };

  const handleProgressPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isScrubbingRef.current) return;
    e.stopPropagation();
    e.preventDefault();
    void seekToClientX(e.clientX, { resumePlayback: false });
  };

  const handleProgressPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isScrubbingRef.current) return;
    isScrubbingRef.current = false;
    e.stopPropagation();
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    void seekToClientX(e.clientX, { resumePlayback: wasPlayingBeforeScrubRef.current });
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (!isExpanded) {
        if (currentScrollY < lastScrollY.current || currentScrollY <= 0) {
          setIsVisible(true);
        } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
          setIsVisible(false);
        }
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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
    const tooltipWidth = 300;

    const xPos = e.clientX - containerBounds.left;
    const yPos = e.clientY - containerBounds.top;

    let finalX = xPos;
    if (xPos + tooltipWidth / 2 > containerBounds.width) {
      finalX = containerBounds.width - tooltipWidth - 16;
    } else if (xPos - tooltipWidth / 2 < 0) {
      finalX = tooltipWidth / 2 + 16;
    }

    setMousePosition({
      x: finalX,
      y: yPos - 16
    });
  };

  const handleContainerClick = async (e: React.MouseEvent) => {
    if (showWelcome) {
      e.stopPropagation();
      await togglePlay();
      return;
    }

    if (!isExpanded) {
      const target = e.target as HTMLElement;
      const isAlbumArea = target.closest(".album-area");
      const isLargeScreen = window.innerWidth >= 640;
      if (isAlbumArea && isLargeScreen) {
        setIsExpanded(true);
      }
    }
  };

  const playNextTrack = async () => {
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    await loadTrack(nextIndex, { autoplay: isPlaying, startTime: 0 });
  };

  const playPreviousTrack = async () => {
    const prevIndex = currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1;
    await loadTrack(prevIndex, { autoplay: isPlaying, startTime: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onClick={handleContainerClick}
      className={`fixed 
        bottom-4 sm:bottom-6 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2
        transition-all duration-300 ease-in-out
        ${isExpanded
          ? "sm:w-[90vw] md:w-[85vw] lg:w-[1125px] max-w-[1125px]"
          : "sm:w-[400px] md:w-[450px] lg:w-[500px] sm:left-1/2"
        }
        z-40
        ${!isVisible && !isExpanded ? "translate-y-[150%]" : "translate-y-0"}
      `}
    >
      <div
        style={{
          backgroundColor: "#EDE9E5",
        }}
        className={`w-full relative overflow-hidden shadow-lg hover:shadow-xl 
          transition-all duration-300 ease-in-out rounded-[24px]
          h-[72px] ${isExpanded ? "sm:h-[108px]" : ""}`}
      >
        {isExpanded && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(false);
            }}
            className="absolute top-4 right-4 z-30 p-2 rounded-lg hover:bg-black/10 hidden sm:flex"
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

        <div className={showWelcome ? "relative h-full" : "flex h-full min-h-0 flex-col"}>
          <div
            className={
              showWelcome
                ? `absolute inset-x-0 inset-y-0 flex items-center gap-4 justify-between px-4 ${
                    isExpanded ? "sm:px-8" : ""
                  } ${isExpanded ? "sm:flex-row" : "flex-row"}`
                : `flex min-h-0 flex-1 items-center px-4 ${
                    isExpanded ? "sm:px-8" : ""
                  } ${isExpanded ? "sm:flex-row" : "flex-row"} gap-4 justify-between`
            }
          >
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className={`album-area ${
                  isExpanded ? "w-16 h-16" : "w-10 h-10"
                } rounded-lg flex-shrink-0 overflow-hidden relative group`}>
                  {showWelcome ? (
                    <img
                      src="/images/placeholder-album.jpg"
                      alt="Music placeholder"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={tracks[currentTrackIndex].artwork}
                      alt={tracks[currentTrackIndex].title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {!showWelcome && !isExpanded && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsExpanded(true);
                      }}
                      className="absolute inset-0 bg-black/0 hover:bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-200 hidden sm:flex items-center justify-center"
                    >
                      <Expand className="w-4 h-4 text-white" />
                    </button>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900 truncate max-w-[200px] sm:max-w-[250px] md:max-w-[300px]">
                      {showWelcome ? "Care for some music?" : tracks[currentTrackIndex].title}
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
                  {isExpanded && !showWelcome && (
                    <p className="text-sm text-gray-500 truncate">{tracks[currentTrackIndex].album}</p>
                  )}
                  {showWelcome && (
                    <p className="text-sm text-gray-500">Click play to begin</p>
                  )}
                </div>
              </div>

              <div className={`${isExpanded ? "flex-1 flex justify-center" : "flex justify-end"}`}>
                <div className={`flex items-center ${isExpanded ? "gap-8" : "gap-4"}`}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playPreviousTrack();
                    }}
                    className={`group relative flex items-center justify-center ${
                      isExpanded ? "w-10 h-10" : "w-8 h-8"
                    }`}
                  >
                    <div className="absolute inset-0 bg-[#D6D2CB] rounded-[10px] transition-all duration-300 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100" />
                    <SkipBack className={`relative ${isExpanded ? "w-5 h-5 sm:w-6 sm:h-6" : "w-4 h-4"}`} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlay();
                    }}
                    className={`group relative flex items-center justify-center ${
                      isExpanded ? "w-[50px] h-[50px]" : "w-8 h-8"
                    }`}
                  >
                    <div className="absolute inset-0 bg-[#D6D2CB] rounded-[10px] transition-all duration-300 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100" />
                    {isPlaying ? (
                      <Pause className={`relative ${isExpanded ? "w-6 h-6 sm:w-[30px] sm:h-[30px]" : "w-5 h-5"}`} />
                    ) : (
                      <Play className={`relative ${isExpanded ? "w-6 h-6 sm:w-[30px] sm:h-[30px]" : "w-5 h-5"}`} />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playNextTrack();
                    }}
                    className={`group relative flex items-center justify-center ${
                      isExpanded ? "w-10 h-10" : "w-8 h-8"
                    }`}
                  >
                    <div className="absolute inset-0 bg-[#D6D2CB] rounded-[10px] transition-all duration-300 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100" />
                    <SkipForward className={`relative ${isExpanded ? "w-5 h-5 sm:w-6 sm:h-6" : "w-4 h-4"}`} />
                  </button>
                </div>
              </div>

              {isExpanded && <div className="flex-shrink-0 w-[100px]" />}
          </div>

          {!showWelcome && (
            <div className="relative z-20 shrink-0 h-1.5 sm:h-2">
              <div
                ref={progressBarRef}
                role="slider"
                aria-label="Seek track position"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress)}
                className="absolute inset-x-0 -top-3 bottom-0 cursor-pointer touch-none select-none"
                onPointerDown={handleProgressPointerDown}
                onPointerMove={handleProgressPointerMove}
                onPointerUp={handleProgressPointerUp}
                onPointerCancel={handleProgressPointerUp}
              >
                <div
                  className={`absolute inset-x-0 bottom-0 h-1.5 sm:h-2 w-full ${
                    isPlaying ? "bg-[#EC6A5C]/10" : ""
                  }`}
                >
                  <div
                    className={`pointer-events-none h-full bg-[#EC6A5C] ${isPlaying ? "" : "transition-[width] duration-200"}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        className="fixed bg-[#17120A] text-white rounded-xl py-3 px-4 text-sm w-[300px] z-50 transition-all duration-300 ease-out pointer-events-none"
        style={{
          left: `${mousePosition.x}px`,
          top: mousePosition.y ? `${mousePosition.y}px` : "0",
          transform: `translate(-50%, -100%) scale(${tooltipVisible ? 1 : 0.97})`,
          opacity: tooltipVisible && mousePosition.y !== null ? 1 : 0,
          visibility: tooltipVisible && mousePosition.y !== null ? "visible" : "hidden",
        }}
      >
        Enjoy this selection of songs I wrote and recorded in my home studio. ♥
      </div>
    </div>
  );
};

export default MusicPlayer;
