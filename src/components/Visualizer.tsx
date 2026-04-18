import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface VisualizerProps {
  isPlaying: boolean;
  className?: string;
}

export default function Visualizer({ isPlaying, className }: VisualizerProps) {
  const bars = Array.from({ length: 32 }, (_, i) => i);

  return (
    <div className={cn("flex items-end justify-center gap-1 h-32 w-full", className)}>
      {bars.map((i) => (
        <motion.div
          key={i}
          className={cn(
            "w-2",
            i % 2 === 0 ? "bg-[#00FFFF]" : "bg-[#FF00FF]"
          )}
          animate={{
            height: isPlaying 
              ? [
                  `${Math.random() * 100}%`,
                  `${Math.random() * 100}%`,
                  `${Math.random() * 100}%`,
                  `${Math.random() * 100}%`
                ] 
              : "4px",
          }}
          transition={{
            duration: 0.2,
            repeat: Infinity,
            delay: i * 0.01,
            ease: "steps(5)", // Stepped animation for jagged look
          }}
          style={{
            boxShadow: isPlaying 
              ? `0 0 15px ${i % 2 === 0 ? '#00FFFF' : '#FF00FF'}` 
              : 'none',
          }}
        />
      ))}
    </div>
  );
}
