import React, { useEffect, useRef, useState } from "react";
import { SkipBack, Play, Pause, SkipForward } from "lucide-react";

const tracks = [
  {
    id: 1,
    title: "Sample Track",
    album: "Test Album",
    url: "https://benjaminkrogh.com/audio/test.mp3",
  },
];

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.crossOrigin = "anonymous";
    audioRef.current.preload = "auto";
    audioRef.current.src = tracks[0].url;
  }, []);

  const togglePlay = async () => {
    try {
      if (!audioRef.current) return;

      if (isPlaying) {
        await audioRef.current.pause();
      } else {
        await audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } catch (err) {
      console.error("Playback error:", err);
    }
  };

  useEffect(() => {
    if (!audioRef.current) return;

    const updateProgress = () => {
      if (!audioRef.current) return;

      const value =
        (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(value || 0);
    };

    audioRef.current.addEventListener("timeupdate", updateProgress);
    return () =>
      audioRef.current?.removeEventListener("timeupdate", updateProgress);
  }, []);

  return (
    <div>
      <div
        style={{ backgroundColor: "#EDE9E5", borderRadius: "32px" }}
        className="w-full max-w-[1400px] mx-auto relative overflow-hidden px-4 sm:px-6 my-6" 
    >
       <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#EC6A5C] rounded-md" />
            <div>
              <h3 className="font-medium text-gray-900">{tracks[0].title}</h3>
              <p className="text-sm text-gray-500">{tracks[0].album}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
              <SkipBack className="w-6 h-6" />
            </button>
            <button
              onClick={togglePlay}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </button>
            <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
              <SkipForward className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
      <div className="h-8 bg-transparent w-full absolute bottom-0">
        <div
          className="h-full transition-all duration-200"
          style={{ width: `${progress}%`, backgroundColor: "#A39F98" }}
        />
      </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
