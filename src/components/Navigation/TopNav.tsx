import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, Cpu, Moon, Sun, Clock } from 'lucide-react';

interface TopNavProps {
  isConnected: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({ isConnected }) => {
  const [time, setTime] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Live updating clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Theme toggle handler
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <header className="glass-card px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 border-t-0 rounded-t-none border-x-0 bg-slate-950/80 sticky top-0 z-50">
      {/* Title / Logo Area */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-tank-blue to-tank-cyan shadow-neon-cyan">
          <Cpu className="w-6 h-6 text-slate-900" />
          {isConnected && (
            <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          )}
        </div>
        <div>
          <h1 className="text-lg md:text-xl font-bold tracking-wider bg-gradient-to-r from-white via-slate-100 to-tank-cyan bg-clip-text text-transparent m-0 font-sans">
            Smart Digital Twin
          </h1>
          <p className="text-xs text-slate-400 font-mono tracking-tight">
            ZedBoard FPGA Water Tank Controller
          </p>
        </div>
      </div>

      {/* Right Side: Status, Clock, Theme, Connections */}
      <div className="flex items-center gap-4 flex-wrap justify-center">
        {/* Live Clock */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300 font-mono text-sm shadow-glass-inset">
          <Clock className="w-4 h-4 text-tank-cyan" />
          <span>{time || '00:00:00'}</span>
        </div>

        {/* Connection Indicator */}
        <div className="flex items-center gap-2">
          {isConnected ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs">
              <Shield className="w-4 h-4" />
              <span className="font-semibold tracking-wide">ONLINE</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs animate-pulse">
              <ShieldAlert className="w-4 h-4" />
              <span className="font-semibold tracking-wide">OFFLINE</span>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-slate-300 transition-colors"
          title="Toggle UI Theme"
          id="theme-toggle-btn"
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-400" />
          )}
        </button>
      </div>
    </header>
  );
};
