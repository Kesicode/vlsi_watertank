import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3 } from 'lucide-react';
import type { DailyWaterUsagePoint } from '../../types';

interface DailyUsageChartProps {
  data: DailyWaterUsagePoint[];
}

export const DailyUsageChart: React.FC<DailyUsageChartProps> = ({ data }) => {
  return (
    <div className="glass-card p-5 h-72 flex flex-col relative overflow-hidden">
      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-4 z-10">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-tank-cyan" />
          <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-400 font-mono m-0">
            Daily Throughput
          </h4>
        </div>
        <span className="text-[9px] font-mono text-slate-500">ACCUMULATIVE FLOW</span>
      </div>

      {/* Recharts Container */}
      <div className="flex-1 w-full z-10 text-[10px] font-mono">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00f2fe" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#00d2ff" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#64748b" 
              tickLine={false} 
              axisLine={false}
              tickMargin={8}
            />
            <YAxis 
              stroke="#64748b" 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(val) => `${val}L`}
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
              formatter={(value: any) => [`${value} Liters`, 'Flow Volume']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Bar 
              dataKey="usage" 
              fill="url(#usageGradient)" 
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
