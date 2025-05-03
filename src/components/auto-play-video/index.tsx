'use client';
import { useState, useRef, useEffect } from 'react';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

const VideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showFallback, setShowFallback] = useState(false);

  // Handle play/pause toggle
  const togglePlay = async () => {
    if (!videoRef.current) return;
    
    try {
      if (videoRef.current.paused) {
        await videoRef.current.play();
        setIsPlaying(true);
        setShowFallback(false);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      setShowFallback(true);
    }
  };

  // Handle mute/unmute toggle
  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMutedState = !videoRef.current.muted;
    videoRef.current.muted = newMutedState;
    setIsMuted(newMutedState);
  };

  // Auto-play with delay
  useEffect(() => {
    const timer = setTimeout(() => {
      togglePlay();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative group w-full max-w-4xl mx-auto mb-10">
      <video
        ref={videoRef}
        muted={isMuted}
        playsInline
        loop
        className="w-full h-screen rounded-lg"
        src="/video1.mp4"
        onClick={togglePlay}
      />

      {/* Controls container */}
      <div className="absolute bottom-4 right-4 left-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={togglePlay}
          className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <FaPause className="text-white text-xl" />
          ) : (
            <FaPlay className="text-white text-xl" />
          )}
        </button>

        <button
          onClick={toggleMute}
          className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <FaVolumeMute className="text-white text-xl" />
          ) : (
            <FaVolumeUp className="text-white text-xl" />
          )}
        </button>
      </div>

      {/* Fallback overlay */}
      {showFallback && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
          <button
            onClick={togglePlay}
            className="flex items-center gap-2 px-6 py-3 bg-white/90 hover:bg-white text-black rounded-full transition-colors"
          >
            <FaPlay className="text-2xl" />
            <span className="font-medium">Play Video</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;