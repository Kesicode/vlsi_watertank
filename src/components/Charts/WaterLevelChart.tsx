import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';
import type { WaterLevelHistoryPoint } from '../../types';

interface WaterLevelChartProps {
  data: WaterLevelHistoryPoint[];
}

export const WaterLevelChart: React.FC<WaterLevelChartProps> = ({ data }) => {
  return (
    <div className="glass-card p-5 h-72 flex flex-col relative overflow-hidden">
      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-4 z-10">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-tank-cyan" />
          <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-400 font-mono m-0">
            Water Level History
          </h4>
        </div>
        <span className="text-[9px] font-mono text-slate-500">REALTIME TELEMETRY</span>
      </div>

      {/* Recharts Container */}
      <div className="flex-1 w-full z-10 text-[10px] font-mono">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="levelGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00d2ff" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#00d2ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="timestamp" 
              stroke="#64748b" 
              tickLine={false} 
              axisLine={false}
              tickMargin={8}
            />
            <YAxis 
              domain={[0, 100]} 
              stroke="#64748b" 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(val) => `${val}%`}
              tickMargin={8}
            />
            <Tooltip
              contentStyle={{
                background: 'rgba(15, 23, 42, 0.85)',
                borderColor: 'rgba(0, 242, 254, 0.3)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                color: '#fff',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '11px',
              }}
              formatter={(value: any) => [`${value}%`, 'Level']}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Area 
              type="monotone" 
              dataKey="level" 
              stroke="#00d2ff" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#levelGradient)" 
              isAnimationActive={false} // Disabled for smooth continuous scrolling
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
