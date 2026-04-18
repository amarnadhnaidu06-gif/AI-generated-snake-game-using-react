import { useEffect, useRef, useState, useCallback } from 'react';
import { Point, Direction } from '../types';
import { GRID_SIZE, CANVAS_SIZE, GAME_SPEED } from '../constants';
import { Activity, Play, RotateCcw, Pause, Skull } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

export default function SnakeGame({ onScoreChange }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const directionRef = useRef<Direction>('RIGHT');
  const lastUpdateRef = useRef<number>(0);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
        y: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
      };
      const collision = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!collision) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    setIsGameOver(false);
    setIsPaused(false);
    setScore(0);
    onScoreChange(0);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (directionRef.current) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= CANVAS_SIZE / GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= CANVAS_SIZE / GRID_SIZE
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      // Self collision
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => {
          const newScore = s + 10;
          onScoreChange(newScore);
          if (newScore > highScore) setHighScore(newScore);
          return newScore;
        });
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, isGameOver, isPaused, generateFood, onScoreChange, highScore]);

  // Game Loop
  useEffect(() => {
    const loop = (timestamp: number) => {
      if (timestamp - lastUpdateRef.current > GAME_SPEED) {
        moveSnake();
        lastUpdateRef.current = timestamp;
      }
      requestAnimationFrame(loop);
    };

    const frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [moveSnake]);

  // Input Handling
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') directionRef.current = 'UP'; break;
        case 'ArrowDown': if (direction !== 'UP') directionRef.current = 'DOWN'; break;
        case 'ArrowLeft': if (direction !== 'RIGHT') directionRef.current = 'LEFT'; break;
        case 'ArrowRight': if (direction !== 'LEFT') directionRef.current = 'RIGHT'; break;
        case ' ': setIsPaused(p => !p); break;
      }
      setDirection(directionRef.current);
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [direction]);

  // Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background - Pitch Black
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw background grid - Cyan lines
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= CANVAS_SIZE; i += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_SIZE, i);
      ctx.stroke();
    }

    // Draw snake - Hard Cyan with Magenta Glow
    snake.forEach((segment, i) => {
      const isHead = i === 0;
      ctx.fillStyle = isHead ? '#FF00FF' : '#00FFFF'; 
      ctx.shadowBlur = isHead ? 20 : 0;
      ctx.shadowColor = '#FF00FF';
      
      const x = segment.x * GRID_SIZE;
      const y = segment.y * GRID_SIZE;
      
      ctx.fillRect(x + 1, y + 1, GRID_SIZE - 2, GRID_SIZE - 2);
    });

    // Draw food - Flashing Magenta
    ctx.fillStyle = '#FF00FF';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00FFFF';
    ctx.fillRect(
      food.x * GRID_SIZE + 4,
      food.y * GRID_SIZE + 4,
      GRID_SIZE - 8,
      GRID_SIZE - 8
    );

    if (isGameOver) {
      // Noise overlay on game over
      for (let i = 0; i < 1000; i++) {
        const x = Math.random() * CANVAS_SIZE;
        const y = Math.random() * CANVAS_SIZE;
        ctx.fillStyle = Math.random() > 0.5 ? '#00FFFF' : '#FF00FF';
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }, [snake, food, isGameOver]);

  return (
    <div className="relative bg-black p-4 border-2 border-cyan shadow-[4px_4px_0_#FF00FF]">
      <div className="flex justify-between items-center mb-4 font-mono text-[10px] tracking-tighter">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-cyan/40 uppercase">ENTITY_DATA</span>
            <span className="text-magenta font-bold text-xl leading-none">{score.toString().padStart(4, '0')}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-cyan/40 uppercase">MAX_CAPACITY</span>
            <div className="flex items-center gap-1">
              <span className="text-cyan font-bold text-xl leading-none">{highScore.toString().padStart(4, '0')}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsPaused(!isPaused)}
            className="jarring-button p-2 flex items-center justify-center"
          >
            {isPaused ? <Play size={12} fill="currentColor" /> : <Pause size={12} fill="currentColor" />}
          </button>
          <button 
            onClick={resetGame}
            className="jarring-button bg-magenta shadow-[4px_4px_0_#00FFFF] p-2 flex items-center justify-center"
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="border-2 border-cyan/20 bg-black cursor-crosshair active:scale-[0.99] transition-transform"
        />

        <AnimatePresence>
          {(isGameOver || isPaused) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-grayscale"
            >
              {isGameOver ? (
                <>
                  <Skull className="text-magenta mb-4 animate-bounce" size={48} />
                  <h2 className="text-3xl font-pixel text-magenta mb-2 uppercase animate-[glitch_0.2s_infinite]">SYSTEM_HALT</h2>
                  <p className="text-cyan/60 mb-8 font-mono text-[10px]">RECOVERY_SEED: {score}</p>
                  <button 
                    onClick={resetGame}
                    className="jarring-button font-pixel text-[10px] py-4 px-8"
                  >
                    REBOOT::0x01
                  </button>
                </>
              ) : (
                <>
                  <Activity className="text-cyan mb-6 animate-pulse" size={32} />
                  <h2 className="text-2xl font-pixel text-cyan mb-8 uppercase">HIBERNATING</h2>
                  <button 
                    onClick={() => setIsPaused(false)}
                    className="jarring-button font-pixel text-[10px] py-4 px-12"
                  >
                    WAKE_PROCESS
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex gap-6 text-[8px] uppercase font-mono text-cyan/30 justify-center tracking-[0.2em] animate-pulse">
        <span>VECTOR::ARROWS</span>
        <span>INTERRUPT::SPACE</span>
      </div>
    </div>
  );
}
