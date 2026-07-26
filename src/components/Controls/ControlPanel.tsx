import React from 'react';
import { ArrowUp, ArrowDown, Cpu, Sliders, AlertOctagon, RotateCcw, ShieldCheck } from 'lucide-react';
import type { TankStatus } from '../../types';
import { fillTank, drainTank, setAutoMode, setManualMode, emergencyStop, resetTank } from '../../services/api';

interface ControlPanelProps {
  status: TankStatus;
  onActionTriggered: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ status, onActionTriggered }) => {
  const isAuto = status.mode === 'AUTO';
  const isError = status.state === 'ERROR';
  
  // Rule-based disabling
  const isFillDisabled = isAuto || isError || status.state === 'FILLING' || status.level >= 95;
  const isDrainDisabled = isAuto || isError || status.state === 'DRAINING' || status.level <= 0;
  const isAutoDisabled = isError || isAuto;
  const isManualDisabled = isError || !isAuto;
  const isStopDisabled = isError;
  const isResetDisabled = !isError && !status.alarm;

  const handleAction = async (apiCall: () => Promise<void>) => {
    try {
      await apiCall();
      onActionTriggered();
    } catch (err) {
      console.error('Failed to execute control action:', err);
    }
  };

  return (
    <div className="glass-card p-6 flex flex-col gap-4 relative overflow-hidden h-full">
      {/* Background grid */}
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

      <div className="flex items-center justify-between border-b border-slate-800 pb-3 z-10">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-tank-cyan" />
          <h3 className="text-sm font-semibold tracking-wider uppercase font-mono text-slate-400 m-0">
            HMI Control Interlock Panel
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
          ZYNQ-7000 SCADA
        </span>
      </div>

      {/* Button Layout Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 z-10 my-1">
        
        {/* Fill Tank */}
        <button
          onClick={() => handleAction(fillTank)}
          disabled={isFillDisabled}
          className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 font-mono ${
            isFillDisabled
              ? 'bg-slate-900/20 border-slate-900 text-slate-600 cursor-not-allowed'
              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/40 hover:shadow-neon-green'
          }`}
          title={isAuto ? 'Disable manual filling in AUTO mode' : 'Trigger manual tank filling'}
        >
          <ArrowUp className="w-6 h-6 mb-2" />
          <span className="text-xs font-bold uppercase tracking-wider">Fill Tank</span>
          <span className="text-[9px] text-slate-500 mt-1">Solenoid 01</span>
        </button>

        {/* Drain Tank */}
        <button
          onClick={() => handleAction(drainTank)}
          disabled={isDrainDisabled}
          className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 font-mono ${
            isDrainDisabled
              ? 'bg-slate-900/20 border-slate-900 text-slate-600 cursor-not-allowed'
              : 'bg-sky-500/10 border-sky-500/20 text-sky-400 hover:bg-sky-500/20 hover:border-sky-500/40 hover:shadow-neon-blue'
          }`}
          title={isAuto ? 'Disable manual draining in AUTO mode' : 'Trigger manual tank draining'}
        >
          <ArrowDown className="w-6 h-6 mb-2" />
          <span className="text-xs font-bold uppercase tracking-wider">Drain Tank</span>
          <span className="text-[9px] text-slate-500 mt-1">Solenoid 02</span>
        </button>

        {/* Auto Mode */}
        <button
          onClick={() => handleAction(setAutoMode)}
          disabled={isAutoDisabled}
          className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 font-mono ${
            isAutoDisabled
              ? isAuto
                ? 'bg-tank-blue/20 border-tank-blue/40 text-tank-blue font-bold shadow-neon-blue'
                : 'bg-slate-900/20 border-slate-900 text-slate-600 cursor-not-allowed'
              : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-tank-blue/30 hover:bg-slate-800/40'
          }`}
        >
          <Cpu className="w-6 h-6 mb-2" />
          <span className="text-xs font-bold uppercase tracking-wider">Auto Mode</span>
          <span className="text-[9px] text-slate-500 mt-1">PLC loop control</span>
        </button>

        {/* Manual Mode */}
        <button
          onClick={() => handleAction(setManualMode)}
          disabled={isManualDisabled}
          className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 font-mono ${
            isManualDisabled
              ? !isAuto
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-500 font-bold shadow-neon-yellow'
                : 'bg-slate-900/20 border-slate-900 text-slate-600 cursor-not-allowed'
              : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-amber-500/30 hover:bg-slate-800/40'
          }`}
        >
          <Sliders className="w-6 h-6 mb-2" />
          <span className="text-xs font-bold uppercase tracking-wider">Manual Mode</span>
          <span className="text-[9px] text-slate-500 mt-1">Override logic</span>
        </button>

        {/* Reset */}
        <button
          onClick={() => handleAction(resetTank)}
          disabled={isResetDisabled}
          className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 font-mono ${
            isResetDisabled
              ? 'bg-slate-900/20 border-slate-900 text-slate-600 cursor-not-allowed'
              : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-500/40 hover:shadow-neon-blue'
          }`}
          title="Reset interlock and clear error conditions"
        >
          <RotateCcw className="w-6 h-6 mb-2" />
          <span className="text-xs font-bold uppercase tracking-wider">Reset Alarm</span>
          <span className="text-[9px] text-slate-500 mt-1">Interlock release</span>
        </button>

        {/* Emergency Stop */}
        <button
          onClick={() => handleAction(emergencyStop)}
          disabled={isStopDisabled}
          className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 font-mono ${
            isStopDisabled
              ? 'bg-slate-900/20 border-slate-900 text-slate-600 cursor-not-allowed'
              : 'bg-red-500/10 border-red-500/40 text-red-500 hover:bg-red-500/30 hover:border-red-500/80 hover:shadow-neon-red font-bold animate-pulse'
          }`}
          title="Force emergency shutdown and lock system"
        >
          <AlertOctagon className="w-6 h-6 mb-2 text-red-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-red-500">E-STOP</span>
          <span className="text-[9px] text-rose-400 mt-1 font-bold">Hard Shutoff</span>
        </button>

      </div>

      {/* Safety message depending on status */}
      <div className="z-10 mt-auto pt-2 border-t border-slate-800/40 flex items-center gap-2 text-[10px] font-mono text-slate-500">
        {isError ? (
          <span className="text-red-500 font-bold animate-pulse flex items-center gap-1">
            <AlertOctagon className="w-3.5 h-3.5" /> SYSTEM TRIPPED. Reset required before operations.
          </span>
        ) : (
          <span className="text-emerald-500 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> System active. Interlocks verified and clear.
          </span>
        )}
      </div>
    </div>
  );
};
