import React from 'react';
import { ToggleLeft, ToggleRight, ShieldAlert, Cpu } from 'lucide-react';

interface ModeCardProps {
  mode: 'AUTO' | 'MANUAL';
}

export const ModeCard: React.FC<ModeCardProps> = ({ mode }) => {
  const isAuto = mode === 'AUTO';

  return (
    <div className="glass-card p-5 flex flex-col justify-between h-36 relative overflow-hidden">
      {/* Background Glow */}
      <div className={`absolute -right-4 -bottom-4 w-20 h-20 rounded-full blur-2xl opacity-10 transition-colors duration-500 ${isAuto ? 'bg-tank-blue' : 'bg-amber-500'}`} />

      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-400 font-mono m-0">
          Control Mode
        </h4>
        <span className="text-[9px] font-mono text-slate-500">ZYNQ REGISTERS</span>
      </div>

      <div className="flex items-center gap-4 mt-2">
        <div className={`p-3 rounded-xl border transition-colors duration-300 ${isAuto ? 'bg-tank-blue/10 border-tank-blue/30 text-tank-blue shadow-neon-blue' : 'bg-amber-500/10 border-amber-500/30 text-amber-500 shadow-neon-yellow'}`}>
          {isAuto ? <Cpu className="w-8 h-8" /> : <ShieldAlert className="w-8 h-8" />}
        </div>

        <div>
          <div className="text-[10px] font-mono text-slate-500">SYSTEM FEEDBACK</div>
          <div className={`text-xl font-bold font-mono tracking-wide ${isAuto ? 'text-tank-blue glow-text-blue' : 'text-amber-500 glow-text-yellow'}`}>
            {mode}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 mt-2 border-t border-slate-800/40 pt-2">
        {isAuto ? (
          <>
            <ToggleRight className="w-4 h-4 text-tank-blue" />
            <span>PLC Loop Feedback Active</span>
          </>
        ) : (
          <>
            <ToggleLeft className="w-4 h-4 text-amber-500" />
            <span>Direct Override Engaged</span>
          </>
        )}
      </div>
    </div>
  );
};
