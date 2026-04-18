import { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Activity, Database, Lock, Search } from 'lucide-react';

export default function App() {
  const [currentScore, setCurrentScore] = useState(0);

  return (
    <div className="relative min-h-screen flex flex-col items-center py-12 px-4 gap-12 font-mono selection:bg-magenta selection:text-white">
      <div className="static-overlay" />
      
      {/* Header */}
      <header className="w-full max-w-6xl flex flex-col items-center gap-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-black border-2 border-cyan text-[10px] px-4 py-1 flex items-center gap-2 shadow-[2px_2px_0_#FF00FF] uppercase tracking-tighter animate-[glitch_2s_infinite]"
        >
          <Activity size={12} className="text-magenta" />
          <span>Core_Process::Stable // Entropy::Lows</span>
        </motion.div>
        
        <div className="relative group overflow-hidden p-4">
          <h1 
            data-text="GLITCH_SYSTEM::ARKADE"
            className="text-4xl md:text-7xl font-pixel text-magenta glitch-text leading-tight mb-2 uppercase"
          >
            GLITCH_SYSTEM::ARKADE
          </h1>
          <div className="h-1 bg-cyan w-full shadow-[0_0_15px_#00FFFF] animate-[glitch-skew_4s_infinite]" />
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Machine Status */}
        <div className="lg:col-span-3 order-2 lg:order-1 space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 bg-black border-2 border-cyan shadow-[4px_4px_0_#FF00FF] relative group overflow-hidden"
          >
            <div className="flex items-center gap-2 mb-4 text-magenta font-pixel text-[10px]">
              <Database size={14} />
              <span>LOGS::0x7F</span>
            </div>
            <div className="space-y-3 text-[10px] uppercase">
              <div className="flex justify-between border-b border-cyan/30 pb-1">
                <span className="text-cyan/60">HEARTBEAT</span>
                <span className="text-cyan">::PULSING</span>
              </div>
              <div className="flex justify-between border-b border-cyan/30 pb-1">
                <span className="text-cyan/60">INTEGRITY</span>
                <span className="text-magenta font-bold">::COMPROMISED</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cyan/60">UPLINK</span>
                <span className="text-cyan">::V4_ACTIVE</span>
              </div>
            </div>
            <div className="absolute inset-0 pointer-events-none border border-magenta/20 animate-pulse" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 bg-black border-2 border-magenta shadow-[4px_4px_0_#00FFFF] overflow-hidden"
          >
            <div className="flex items-center gap-2 mb-4 text-cyan font-pixel text-[10px]">
              <Lock size={14} />
              <span>PROTOCOLS</span>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] text-cyan/60">THREADS</span>
                <span className="text-2xl font-bold font-pixel text-magenta">256</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-[10px] text-cyan/60">PEAK_DATA</span>
                <span className="text-2xl font-bold font-pixel text-cyan animate-pulse">9850</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Center Canvas Area: The Main Neural Chamber */}
        <div className="lg:col-span-6 flex justify-center order-1 lg:order-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="screen-tear border-4 border-cyan p-1 bg-magenta/10 shadow-[8px_8px_0_#000000,12px_12px_0_#FF00FF]"
          >
            <SnakeGame onScoreChange={setCurrentScore} />
          </motion.div>
        </div>

        {/* Right Column: Audio Frequency Distorter */}
        <div className="lg:col-span-3 order-3 space-y-8 flex flex-col items-center lg:items-end">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full"
          >
            <MusicPlayer />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full p-6 bg-black border-2 border-cyan shadow-[4px_4px_0_#FF00FF] overflow-hidden group"
          >
            <div className="flex items-center gap-2 mb-4 text-magenta font-pixel text-[10px]">
              <Search size={14} />
              <span>SENSORS</span>
            </div>
            <div className="space-y-4">
               <div className="space-y-2">
                  <div className="h-4 bg-cyan/10 border border-cyan/30 relative overflow-hidden">
                    <motion.div 
                      animate={{ left: ["-100%", "100%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="absolute top-0 w-20 h-full bg-magenta shadow-[0_0_15px_#FF00FF]"
                    />
                  </div>
                  <p className="text-[8px] font-mono text-cyan/40 italic uppercase animate-pulse">Locating_Neural_Artifacts...</p>
               </div>
               <div className="text-[10px] text-magenta leading-none uppercase">
                  Node_7_Connected::True
               </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer: Transmission End */}
      <footer className="mt-auto pt-12 pb-6 w-full max-w-6xl border-t-2 border-cyan/20 flex flex-col md:flex-row justify-between items-center gap-4 text-cyan/40 font-mono text-[9px] uppercase tracking-tighter">
        <div className="flex gap-8">
          <span className="hover:text-magenta transition-all cursor-pointer">TERMINATE_AGREEMENT</span>
          <span className="hover:text-magenta transition-all cursor-pointer">MACHINE_ETHICS</span>
        </div>
        <p className="font-pixel text-[8px] animate-pulse">TRANSMISSION_ID::ARKADE_ALPHA_99</p>
        <div className="flex gap-8">
          <span className="text-magenta/60">END_OFF_LINE_</span>
        </div>
      </footer>
    </div>
  );
}
