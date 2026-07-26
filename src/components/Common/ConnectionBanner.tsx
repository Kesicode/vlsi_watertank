import React from 'react';
import { WifiOff, Loader } from 'lucide-react';

interface ConnectionBannerProps {
  isConnected: boolean;
}

export const ConnectionBanner: React.FC<ConnectionBannerProps> = ({ isConnected }) => {
  if (isConnected) return null;

  return (
    <div className="fixed inset-0 z-40 bg-[#060814]/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 transition-all duration-300">
      <div className="glass-card max-w-md p-8 flex flex-col items-center gap-6 border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.15)]">
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-full text-red-400 animate-pulse">
          <WifiOff className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold tracking-wide text-white m-0">
          Telemetry Link Interrupted
        </h2>
        <p className="text-slate-400 text-sm max-w-xs m-0">
          Lost connection to the ZedBoard FPGA controller. Attempting to re-establish real-time connection.
        </p>
        <div className="flex items-center gap-2.5 text-tank-cyan text-sm font-mono mt-2">
          <Loader className="w-4 h-4 animate-spin" />
          <span>Waiting for ZedBoard...</span>
        </div>
      </div>
    </div>
  );
};
