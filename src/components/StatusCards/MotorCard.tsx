import React from 'react';
import { Cog, Zap, ZapOff } from 'lucide-react';

interface MotorCardProps {
  isRunning: boolean;
}

export const MotorCard: React.FC<MotorCardProps> = ({ isRunning }) => {
  return (
    <div className="glass-card p-5 flex flex-col justify-between h-36 relative overflow-hidden">
      {/* Background Glow */}
      <div className={`absolute -right-4 -bottom-4 w-20 h-20 rounded-full blur-2xl opacity-10 transition-colors duration-500 ${isRunning ? 'bg-emerald-500' : 'bg-slate-500'}`} />

      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-400 font-mono m-0">
          Motor Controller
        </h4>
        {isRunning ? (
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        ) : (
          <span className="h-2 w-2 rounded-full bg-slate-600" />
        )}
      </div>

      <div className="flex items-center gap-4 mt-2">
        {/* Animated Cog */}
        <div className={`p-3 rounded-xl border transition-colors duration-300 ${isRunning ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-neon-green' : 'bg-slate-900/60 border-slate-800 text-slate-500'}`}>
          <Cog className={`w-8 h-8 ${isRunning ? 'spin-gear-active' : ''}`} />
        </div>

        <div>
          <div className="text-[10px] font-mono text-slate-500">ACTUATOR STATE</div>
          <div className={`text-xl font-bold font-mono tracking-wide ${isRunning ? 'text-emerald-400 glow-text-green' : 'text-slate-400'}`}>
            {isRunning ? 'RUNNING' : 'STOPPED'}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400 mt-2 border-t border-slate-800/40 pt-2">
        {isRunning ? (
          <>
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Power Output: 2.4 kW</span>
          </>
        ) : (
          <>
            <ZapOff className="w-3.5 h-3.5 text-slate-500" />
            <span>Power Output: 0.0 kW</span>
          </>
        )}
      </div>
    </div>
  );
};
