import React from 'react';
import { motion } from 'framer-motion';
import { Droplet, AlertTriangle } from 'lucide-react';

interface WaterTankProps {
  level: number; // 0 - 100
}

export const WaterTank: React.FC<WaterTankProps> = ({ level }) => {
  // Determine water color and status text based on level
  const isLow = level <= 20;
  const isOverflow = level >= 90;
  
  let waterColorClass = 'from-blue-600/60 to-tank-cyan/70 shadow-[0_0_20px_rgba(0,210,255,0.4)]';
  let glowTextClass = 'glow-text-cyan text-tank-cyan';
  let statusText = 'Normal';
  
  if (isLow) {
    waterColorClass = 'from-amber-600/60 to-tank-yellow/70 shadow-[0_0_20px_rgba(245,158,11,0.4)]';
    glowTextClass = 'glow-text-yellow text-tank-yellow';
    statusText = 'Low Level';
  } else if (isOverflow) {
    waterColorClass = 'from-red-600/60 to-tank-red/70 shadow-[0_0_20px_rgba(239,68,68,0.5)]';
    glowTextClass = 'glow-text-red text-tank-red';
    statusText = 'Overflow Warning';
  }

  // Pre-generate bubble parameters for stable render
  const bubbles = [
    { left: '10%', size: '8px', delay: '0s', duration: '3s' },
    { left: '25%', size: '6px', delay: '1.2s', duration: '2.5s' },
    { left: '40%', size: '10px', delay: '0.5s', duration: '4s' },
    { left: '55%', size: '5px', delay: '2.1s', duration: '2.8s' },
    { left: '70%', size: '9px', delay: '1.5s', duration: '3.5s' },
    { left: '85%', size: '7px', delay: '0.8s', duration: '3.2s' },
    { left: '33%', size: '6px', delay: '2.7s', duration: '2.9s' },
    { left: '62%', size: '8px', delay: '1.9s', duration: '3.7s' },
  ];

  return (
    <div className="glass-card p-6 flex flex-col items-center justify-between h-[520px] relative overflow-hidden">
      {/* Background industrial grid pattern */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      {/* Header Info */}
      <div className="w-full text-center z-10">
        <h3 className="text-sm font-semibold tracking-wider text-slate-400 uppercase font-mono m-0 flex items-center justify-center gap-1.5">
          <Droplet className="w-4 h-4 text-tank-cyan animate-pulse" />
          Twin Tank Telemetry
        </h3>
        <p className={`text-xs font-mono mt-1 ${isLow || isOverflow ? 'text-rose-400 font-bold' : 'text-slate-400'}`}>
          State: {statusText}
        </p>
      </div>

      {/* Vertical Tank Body container */}
      <div className="flex gap-4 items-center justify-center w-full my-4 h-[380px] z-10">
        
        {/* Left Side: Ruler ticks */}
        <div className="flex flex-col justify-between h-[300px] text-[10px] font-mono text-slate-500 pr-1">
          <span>100% —</span>
          <span>75% —</span>
          <span>50% —</span>
          <span>25% —</span>
          <span>0% —</span>
        </div>

        {/* The Tank Shell */}
        <div className="relative w-44 h-[320px] rounded-3xl border-2 border-slate-700 bg-slate-950/60 shadow-glass-inset backdrop-blur-sm flex items-end p-0.5 overflow-hidden">
          {/* Inner glass tube shine overlay */}
          <div className="absolute top-0 bottom-0 left-2 w-4 bg-white/5 rounded-full pointer-events-none z-20" />
          <div className="absolute top-0 bottom-0 right-2 w-2 bg-white/5 rounded-full pointer-events-none z-20" />

          {/* Water liquid wrapper with height animation */}
          <motion.div
            className={`w-full rounded-2xl bg-gradient-to-t ${waterColorClass} relative overflow-hidden`}
            initial={{ height: '0%' }}
            animate={{ height: `${level}%` }}
            transition={{ type: 'spring', damping: 15, stiffness: 60 }}
          >
            {/* Wave cap effect */}
            <div className="absolute top-0 left-0 right-0 h-3 bg-white/20 blur-[1px] rounded-t-2xl animate-pulse" />

            {/* Bubble animations inside liquid */}
            {level > 5 && bubbles.map((bubble, idx) => (
              <div
                key={idx}
                className="bubble"
                style={{
                  left: bubble.left,
                  width: bubble.size,
                  height: bubble.size,
                  animationDelay: bubble.delay,
                  animationDuration: bubble.duration,
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* Right Side: Level Info Box */}
        <div className="flex flex-col items-center justify-center min-w-[70px]">
          <span className="text-xs text-slate-500 font-mono">LEVEL</span>
          <span className={`text-3xl font-bold font-mono tracking-tight ${glowTextClass}`}>
            {level}%
          </span>
          {isOverflow && (
            <AlertTriangle className="w-5 h-5 text-tank-red animate-bounce mt-2" />
          )}
          {isLow && (
            <AlertTriangle className="w-5 h-5 text-tank-yellow animate-pulse mt-2" />
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="w-full text-center text-[10px] font-mono text-slate-500 z-10">
        ZedBoard ADC Channel 0 • Analog Signal Twin
      </div>
    </div>
  );
};
