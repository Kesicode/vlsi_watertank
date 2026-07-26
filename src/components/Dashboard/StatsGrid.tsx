import React from 'react';
import { motion } from 'framer-motion';
import { Activity, RefreshCw, BarChart2, AlertCircle, ShieldAlert, Clock, Droplet, Cog, Cpu } from 'lucide-react';
import type { TankStatus } from '../../types';

interface StatsGridProps {
  status: TankStatus;
}

const AnimatedMetric: React.FC<{ value: string | number; className?: string }> = ({ value, className = '' }) => {
  return (
    <motion.span
      key={value}
      initial={{ scale: 0.85, y: -4, opacity: 0.7 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 350, damping: 12 }}
      className={`inline-block ${className}`}
    >
      {value}
    </motion.span>
  );
};

export const StatsGrid: React.FC<StatsGridProps> = ({ status }) => {
  const stats = [
    {
      label: 'Telemetry Level',
      value: `${status.level}%`,
      icon: <Droplet className="w-4 h-4 text-tank-cyan" />,
      colorClass: status.level >= 90 ? 'text-red-400 font-semibold' : status.level <= 20 ? 'text-yellow-400 font-semibold' : 'text-tank-cyan',
    },
    {
      label: 'Motor Status',
      value: status.motor ? 'ACTIVE (ON)' : 'STANDBY (OFF)',
      icon: <Cog className={`w-4 h-4 ${status.motor ? 'spin-gear-active text-emerald-400' : 'text-slate-400'}`} />,
      colorClass: status.motor ? 'text-emerald-400 font-bold' : 'text-slate-400',
    },
    {
      label: 'Operating Mode',
      value: status.mode,
      icon: <Cpu className="w-4 h-4 text-purple-400" />,
      colorClass: status.mode === 'AUTO' ? 'text-tank-blue font-bold' : 'text-amber-500 font-bold',
    },
    {
      label: 'System Uptime',
      value: status.uptime,
      icon: <Clock className="w-4 h-4 text-indigo-400" />,
      colorClass: 'text-indigo-300 font-mono',
    },
    {
      label: 'Fill Cycles',
      value: status.fillCount,
      icon: <RefreshCw className="w-4 h-4 text-blue-400" />,
      colorClass: 'text-blue-300',
    },
    {
      label: 'Drain Cycles',
      value: status.drainCount,
      icon: <BarChart2 className="w-4 h-4 text-sky-400" />,
      colorClass: 'text-sky-300',
    },
    {
      label: 'Alarm Count',
      value: status.overflowCount,
      icon: <AlertCircle className="w-4 h-4 text-red-400" />,
      colorClass: status.overflowCount > 0 ? 'text-red-400 font-bold' : 'text-slate-400',
    },
    {
      label: 'Error Shutdowns',
      value: status.errorCount,
      icon: <ShieldAlert className="w-4 h-4 text-rose-500" />,
      colorClass: status.errorCount > 0 ? 'text-rose-500 font-bold' : 'text-slate-400',
    },
  ];

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex items-center gap-2 mb-1">
        <Activity className="w-5 h-5 text-tank-cyan animate-pulse" />
        <h3 className="text-sm font-semibold tracking-wider uppercase font-mono text-slate-400 m-0">
          Real-Time Statistics
        </h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            className="glass-card p-4 flex flex-col justify-between min-h-[95px] relative overflow-hidden group hover:border-slate-700/60"
          >
            {/* Top Row: label and icon */}
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-mono tracking-wider uppercase">
                {stat.label}
              </span>
              <div className="p-1.5 rounded-lg bg-slate-900/60 border border-slate-800/40">
                {stat.icon}
              </div>
            </div>

            {/* Bottom Row: value */}
            <div className="mt-2 flex items-baseline">
              <AnimatedMetric 
                value={stat.value} 
                className={`text-lg font-bold font-mono tracking-tight ${stat.colorClass}`}
              />
            </div>
            
            {/* Decorative Corner highlight */}
            <div className="absolute top-0 right-0 w-[2px] h-0 bg-tank-cyan group-hover:h-3 transition-all duration-300" />
            <div className="absolute top-0 right-0 w-0 h-[2px] bg-tank-cyan group-hover:w-3 transition-all duration-300" />
          </div>
        ))}
      </div>
    </div>
  );
};
