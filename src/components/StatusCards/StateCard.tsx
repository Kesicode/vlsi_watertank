import React from 'react';
import { Activity, PlayCircle, CheckCircle, AlertTriangle, AlertOctagon, ArrowDownCircle } from 'lucide-react';

interface StateCardProps {
  state: 'IDLE' | 'FILLING' | 'DRAINING' | 'FULL' | 'LOW' | 'EMPTY' | 'OVERFLOW' | 'ERROR';
}

export const StateCard: React.FC<StateCardProps> = ({ state }) => {
  // Setup color styling and icons based on the active state
  const getStateMeta = () => {
    switch (state) {
      case 'FILLING':
        return {
          label: 'FILLING',
          colorClass: 'text-tank-blue glow-text-blue border-tank-blue/30 bg-tank-blue/10 shadow-neon-blue',
          icon: <PlayCircle className="w-8 h-8 animate-pulse text-tank-blue" />,
          details: 'Pump Solenoid OPEN',
        };
      case 'DRAINING':
        return {
          label: 'DRAINING',
          colorClass: 'text-sky-400 glow-text-blue border-sky-500/30 bg-sky-500/10',
          icon: <ArrowDownCircle className="w-8 h-8 text-sky-400" />,
          details: 'Drain Solenoid OPEN',
        };
      case 'FULL':
        return {
          label: 'TANK FULL',
          colorClass: 'text-emerald-400 glow-text-green border-emerald-500/30 bg-emerald-500/10',
          icon: <CheckCircle className="w-8 h-8 text-emerald-400" />,
          details: 'Max Limit Threshold',
        };
      case 'LOW':
        return {
          label: 'LOW LEVEL',
          colorClass: 'text-amber-500 glow-text-yellow border-amber-500/30 bg-amber-500/10',
          icon: <AlertTriangle className="w-8 h-8 text-amber-500 animate-bounce" />,
          details: 'Below 15% Trigger',
        };
      case 'EMPTY':
        return {
          label: 'EMPTY',
          colorClass: 'text-orange-500 glow-text-yellow border-orange-500/30 bg-orange-500/10',
          icon: <AlertOctagon className="w-8 h-8 text-orange-500" />,
          details: 'Critical Low Level',
        };
      case 'OVERFLOW':
        return {
          label: 'OVERFLOW',
          colorClass: 'text-red-500 glow-text-red border-red-500/30 bg-red-500/10 animate-pulse',
          icon: <AlertOctagon className="w-8 h-8 text-red-500 animate-ping" />,
          details: 'Max Capacity Exceeded',
        };
      case 'ERROR':
        return {
          label: 'SYSTEM ERROR',
          colorClass: 'text-red-600 glow-text-red border-red-600/30 bg-red-600/10',
          icon: <AlertOctagon className="w-8 h-8 text-red-600" />,
          details: 'Emergency Interlock Active',
        };
      case 'IDLE':
      default:
        return {
          label: 'STANDBY / IDLE',
          colorClass: 'text-slate-400 border-slate-800 bg-slate-900/60',
          icon: <Activity className="w-8 h-8 text-slate-500" />,
          details: 'Steady State System',
        };
    }
  };

  const meta = getStateMeta();

  return (
    <div className="glass-card p-5 flex flex-col justify-between h-36 relative overflow-hidden">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-400 font-mono m-0">
          Controller State
        </h4>
        <span className="text-[9px] font-mono text-slate-500">STATE REG 0x02</span>
      </div>

      <div className="flex items-center gap-4 mt-2">
        <div className={`p-3 rounded-xl border transition-all duration-300 ${meta.colorClass}`}>
          {meta.icon}
        </div>

        <div>
          <div className="text-[10px] font-mono text-slate-500">CURRENT OPERATION</div>
          <div className={`text-xl font-bold font-mono tracking-wide ${meta.colorClass.split(' ').find(c => c.startsWith('text-'))}`}>
            {meta.label}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 mt-2 border-t border-slate-800/40 pt-2">
        <span>{meta.details}</span>
      </div>
    </div>
  );
};
