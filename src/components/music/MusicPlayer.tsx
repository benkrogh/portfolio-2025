import React, { useEffect, useRef, useState, useCallback } from "react";
import { SkipBack, Play, Pause, SkipForward } from "lucide-react";

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioAnalyser, setAudioAnalyser] = useState<AudioAnalyser | null>(
    null,
  );
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);

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
    if (!audioRef.current) {
      audioRef.current = new Audio(tracks[0].url);
      audioRef.current.preload = "auto";

      audioRef.current.addEventListener("error", (e) => {
        console.error("Audio error:", e);
      });

      audioRef.current.addEventListener("loadedmetadata", () => {
        setDuration(audioRef.current?.duration || 0);
      });
    }

    const cleanup = setupAudioAnalyser();

    return () => {
      cleanup?.();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [setupAudioAnalyser]);

  useEffect(() => {
    if (!audioRef.current) return;

    const updateProgress = () => {
      if (!audioRef.current) return;
      setCurrentTime(audioRef.current.currentTime);
      const value =
        (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(value || 0);
    };

    audioRef.current.addEventListener("timeupdate", updateProgress);
    return () =>
      audioRef.current?.removeEventListener("timeupdate", updateProgress);
  }, []);

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
    if (!audioRef.current) return;

    const progressBar = e.currentTarget;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const progressBarWidth = progressBar.offsetWidth;
    const percentage = clickPosition / progressBarWidth;
    const newTime = percentage * audioRef.current.duration;

    audioRef.current.currentTime = newTime;
    setProgress(percentage * 100);
  };

  return (
    <div className="mb-6">
      <div
        style={{
          backgroundColor: "#EDE9E5",
          borderRadius: "24px",
          height: "144px",
        }}
        className="w-full max-w-[1500px] mx-auto relative overflow-hidden"
      >
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
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-4 sm:px-8">
            <div className="w-full flex flex-col sm:flex-row items-center gap-4 sm:gap-0 sm:justify-between">
              <div className="flex items-center gap-4 sm:w-1/4">
                <div className="w-12 h-12 bg-[#EC6A5C] rounded-lg" />
                <div>
                  <h3 className="font-medium text-gray-900">
                    {tracks[0].title}
                  </h3>
                  <p className="text-sm text-gray-500">{tracks[0].album}</p>
                </div>
              </div>
              <div className="flex items-center gap-8 sm:w-1/2 justify-center">
                <button className="w-10 h-10 group relative flex items-center justify-center">
                  <div
                    className={`absolute inset-0 bg-[#D6D2CB] rounded-[10px] transition-all duration-300 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 ${isPlaying ? "group-hover:opacity-60" : ""}`}
                  />
                  <SkipBack className="w-5 h-5 sm:w-6 sm:h-6 relative" />
                </button>
                <button
                  onClick={togglePlay}
                  className="w-[50px] h-[50px] group relative flex items-center justify-center"
                >
                  <div
                    className={`absolute inset-0 bg-[#D6D2CB] rounded-[10px] transition-all duration-300 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 ${isPlaying ? "group-hover:opacity-60" : ""}`}
                  />
                  {isPlaying ? (
                    <Pause className="w-6 h-6 sm:w-[30px] sm:h-[30px] relative" />
                  ) : (
                    <Play className="w-6 h-6 sm:w-[30px] sm:h-[30px] relative" />
                  )}
                </button>
                <button className="w-10 h-10 group relative flex items-center justify-center">
                  <div
                    className={`absolute inset-0 bg-[#D6D2CB] rounded-[10px] transition-all duration-300 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 ${isPlaying ? "group-hover:opacity-60" : ""}`}
                  />
                  <SkipForward className="w-5 h-5 sm:w-6 sm:h-6 relative" />
                </button>
              </div>
              <div className="hidden sm:block sm:w-1/4" />
            </div>
          </div>
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
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
