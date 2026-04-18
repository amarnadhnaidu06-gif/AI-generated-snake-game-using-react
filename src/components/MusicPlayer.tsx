import { useState, useEffect, useCallback, useRef } from 'react';
import { Howl } from 'howler';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX,
  FastForward,
  List
} from 'lucide-react';
import { TRACKS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import Visualizer from './Visualizer';

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  
  const soundRef = useRef<Howl | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  const handlePlayPause = useCallback(() => {
    if (!soundRef.current) return;
    
    if (isPlaying) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const playTrack = useCallback((index: number) => {
    if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current.unload();
    }

    const track = TRACKS[index];
    const sound = new Howl({
      src: [track.url],
      html5: true,
      volume: isMuted ? 0 : volume,
      onplay: () => {
        setIsPlaying(true);
        startProgress();
      },
      onpause: () => setIsPlaying(false),
      onstop: () => {
        setIsPlaying(false);
        stopProgress();
      },
      onend: () => {
        setIsPlaying(false);
        stopProgress();
        handleNext();
      },
      onloaderror: (id, err) => {
        console.error('Audio Stream Interrupted', err);
      }
    });

    soundRef.current = sound;
    sound.play();
    setCurrentTrackIndex(index);
  }, [volume, isMuted]);

  const handleNext = useCallback(() => {
    const nextIndex = (currentTrackIndex + 1) % TRACKS.length;
    playTrack(nextIndex);
  }, [currentTrackIndex, playTrack]);

  const handlePrev = useCallback(() => {
    const prevIndex = (currentTrackIndex - 1 + TRACKS.length) % TRACKS.length;
    playTrack(prevIndex);
  }, [currentTrackIndex, playTrack]);

  const startProgress = () => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    progressIntervalRef.current = window.setInterval(() => {
      if (soundRef.current && isPlaying) {
        const seek = soundRef.current.seek();
        const duration = soundRef.current.duration();
        setProgress((seek / duration) * 100);
      }
    }, 500);
  };

  const stopProgress = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTime = soundRef.current ? soundRef.current.seek() as number : 0;
  const duration = soundRef.current ? soundRef.current.duration() : currentTrack.duration;

  useEffect(() => {
    playTrack(0);
    if (soundRef.current) soundRef.current.pause();
    setIsPlaying(false);

    return () => {
      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current.unload();
      }
      stopProgress();
    };
  }, []);

  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(isMuted ? 0 : volume);
    }
  }, [volume, isMuted]);

  return (
    <div className="relative w-full max-w-sm bg-black border-2 border-magenta shadow-[4px_4px_0_#00FFFF] overflow-hidden">
      <div className="relative p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-[#00FFFF] text-black">
              <FastForward size={14} />
            </div>
            <span className="text-[10px] font-pixel uppercase tracking-tighter text-cyan">FREQ_DISTORT_V.IX</span>
          </div>
          <button 
            onClick={() => setShowPlaylist(!showPlaylist)}
            className={cn(
              "p-2 border-2 transition-all",
              showPlaylist ? "bg-cyan text-black border-cyan" : "bg-black text-cyan border-cyan hover:bg-cyan/10"
            )}
          >
            <List size={16} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {showPlaylist ? (
            <motion.div
              key="playlist"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-1 mb-6 h-48 overflow-y-auto pr-2 custom-scrollbar"
            >
              {TRACKS.map((track, i) => (
                <button
                  key={track.id}
                  onClick={() => playTrack(i)}
                  className={cn(
                    "w-full flex items-center justify-between p-2 border transition-all text-left",
                    i === currentTrackIndex 
                      ? "bg-magenta/20 border-magenta text-magenta" 
                      : "bg-black border-cyan/20 text-cyan/60 hover:border-cyan hover:text-cyan"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[8px] opacity-40">#{i}</span>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold line-clamp-1 uppercase">{track.title}</span>
                      <span className="text-[8px] opacity-60">BIT_RATE::320K</span>
                    </div>
                  </div>
                </button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="nowplaying"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center mb-6"
            >
              <div className="relative w-40 h-40 mb-6 border-2 border-cyan/50 p-2 group">
                <div className="absolute inset-0 bg-cyan/5 grayscale opacity-20 pointer-events-none" />
                <div className="w-full h-full border border-magenta flex items-center justify-center bg-black overflow-hidden">
                  <Visualizer isPlaying={isPlaying} />
                </div>
                {/* Status indicator */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-magenta animate-pulse shadow-[0_0_10px_#FF00FF]" />
              </div>

              <div className="text-center w-full px-2">
                <h3 className="text-sm font-pixel text-cyan mb-1 truncate uppercase leading-none">
                  {currentTrack.title}
                </h3>
                <p className="text-[10px] text-magenta font-mono uppercase tracking-widest mt-2">
                  SOURCE::{currentTrack.artist}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress System */}
        <div className="mb-6">
          <div className="relative h-2 w-full bg-cyan/10 border border-cyan/30 overflow-hidden">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-magenta shadow-[0_0_10px_#FF00FF]"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
          <div className="flex justify-between items-center mt-2 font-mono text-[8px] text-cyan/60">
            <span>{formatTime(currentTime)}</span>
            <span className="animate-pulse">STREAMING...</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Console Controls */}
        <div className="flex items-center justify-center gap-6">
          <button 
            onClick={handlePrev}
            className="p-3 text-cyan hover:text-magenta transition-all"
          >
            <SkipBack size={20} fill="currentColor" />
          </button>
          
          <button 
            onClick={handlePlayPause}
            className="jarring-button w-16 h-16 flex items-center justify-center"
          >
            {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} className="ml-1" fill="currentColor" />}
          </button>

          <button 
            onClick={handleNext}
            className="p-3 text-cyan hover:text-magenta transition-all"
          >
            <SkipForward size={20} fill="currentColor" />
          </button>
        </div>
      </div>
      
      {/* Decorative Machine Elements */}
      <div className="flex justify-between px-2 pb-1 opacity-20 text-[6px] font-mono">
        <span>BUFFER_OVERFLOW::0%</span>
        <span>LATENCY::5ms</span>
      </div>
    </div>
  );
}
