import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, CheckCircle, AlertTriangle, AlertOctagon, Terminal } from 'lucide-react';
import type { TankEvent } from '../../types';

interface EventTimelineProps {
  events: TankEvent[];
}

export const EventTimeline: React.FC<EventTimelineProps> = ({ events }) => {
  const getEventStyle = (type: TankEvent['type']) => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle className="w-4 h-4 text-emerald-400" />,
          bgColor: 'bg-emerald-500/10 border-emerald-500/20',
          textColor: 'text-emerald-400',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-4 h-4 text-yellow-400" />,
          bgColor: 'bg-yellow-500/10 border-yellow-500/20',
          textColor: 'text-yellow-400',
        };
      case 'error':
        return {
          icon: <AlertOctagon className="w-4 h-4 text-red-500" />,
          bgColor: 'bg-red-500/10 border-red-500/20',
          textColor: 'text-red-400',
        };
      case 'info':
      default:
        return {
          icon: <Info className="w-4 h-4 text-tank-cyan" />,
          bgColor: 'bg-slate-900/60 border-slate-800/60',
          textColor: 'text-slate-300',
        };
    }
  };

  return (
    <div className="glass-card p-6 flex flex-col h-[520px] relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 z-10">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-tank-cyan" />
          <h3 className="text-sm font-semibold tracking-wider uppercase font-mono text-slate-400 m-0">
            System Event Log
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-500">
          REGISTERS
        </span>
      </div>

      {/* Events List Container */}
      <div className="flex-1 overflow-y-auto pr-1 z-10 flex flex-col gap-2.5">
        <AnimatePresence initial={false} mode="popLayout">
          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 text-xs font-mono">
              <span>No telemetry events recorded.</span>
            </div>
          ) : (
            events.map((event) => {
              const style = getEventStyle(event.type);
              return (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, y: -15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className={`flex items-start gap-3 p-3 rounded-xl border ${style.bgColor} transition-all duration-300`}
                >
                  {/* Event Icon */}
                  <div className="mt-0.5 p-1 rounded-lg bg-slate-950/40 border border-slate-800">
                    {style.icon}
                  </div>

                  {/* Message and Time */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-[10px] font-mono text-slate-500">
                        {event.timestamp}
                      </span>
                      <span className={`text-[8px] font-mono font-semibold tracking-wider uppercase px-1.5 py-0.25 rounded bg-slate-950/60 ${style.textColor}`}>
                        {event.type}
                      </span>
                    </div>
                    <p className={`text-xs font-mono mt-1 leading-relaxed ${style.textColor}`}>
                      {event.message}
                    </p>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Footer log count */}
      <div className="z-10 pt-3 border-t border-slate-800/40 mt-3 text-[9px] font-mono text-slate-500 flex justify-between">
        <span>LOG_BUF: ACTIVE</span>
        <span>COUNT: {events.length}</span>
      </div>
    </div>
  );
};
