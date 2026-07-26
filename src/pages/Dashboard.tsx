import React from 'react';
import { useTankData } from '../hooks/useTankData';
import { useEvents } from '../hooks/useEvents';
import { useChartData } from '../hooks/useChartData';
import { TopNav } from '../components/Navigation/TopNav';
import { ConnectionBanner } from '../components/Common/ConnectionBanner';
import { WaterTank } from '../components/Tank/WaterTank';
import { MotorCard } from '../components/StatusCards/MotorCard';
import { ModeCard } from '../components/StatusCards/ModeCard';
import { StateCard } from '../components/StatusCards/StateCard';
import { StatsGrid } from '../components/Dashboard/StatsGrid';
import { ControlPanel } from '../components/Controls/ControlPanel';
import { EventTimeline } from '../components/Timeline/EventTimeline';
import { WaterLevelChart } from '../components/Charts/WaterLevelChart';
import { MotorActivityChart } from '../components/Charts/MotorActivityChart';
import { DailyUsageChart } from '../components/Charts/DailyUsageChart';
import { LayoutGrid, Loader2 } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { status, isConnected, isLoading, refetch } = useTankData();
  const { events } = useEvents();
  const { levelHistory, motorHistory, dailyUsage } = useChartData(status);

  // If loading the first time and status is empty, display a loading screen
  if (isLoading && !status) {
    return (
      <div className="min-h-screen bg-[#060814] flex flex-col items-center justify-center text-slate-300 font-mono gap-4">
        <Loader2 className="w-10 h-10 text-tank-cyan animate-spin" />
        <span>Initializing Telemetry Buffers...</span>
      </div>
    );
  }

  // Fallback status if somehow undefined (should not happen due to initial mock loading)
  const activeStatus = status || {
    level: 0,
    motor: false,
    mode: 'AUTO' as const,
    state: 'IDLE' as const,
    alarm: false,
    fillCount: 0,
    drainCount: 0,
    overflowCount: 0,
    errorCount: 0,
    uptime: '00:00:00',
  };

  return (
    <div className="min-h-screen bg-[#060814] flex flex-col">
      {/* Connection Banner overlay */}
      <ConnectionBanner isConnected={isConnected} />

      {/* Navigation Header */}
      <TopNav isConnected={isConnected} />

      {/* Main Content Area */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full flex flex-col gap-6">
        
        {/* Top telemetry grid section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Side: Water Tank & Mini Status Cards */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
            <WaterTank level={activeStatus.level} />
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-6">
              <StateCard state={activeStatus.state} />
              <MotorCard isRunning={activeStatus.motor} />
              <ModeCard mode={activeStatus.mode} />
            </div>
          </div>

          {/* Center Side: Stats Dashboard & Live Solenoid Controls */}
          <div className="lg:col-span-7 xl:col-span-5 flex flex-col gap-6 justify-between">
            <div className="flex-1 flex flex-col justify-start">
              <StatsGrid status={activeStatus} />
            </div>
            <div className="mt-2">
              <ControlPanel status={activeStatus} onActionTriggered={refetch} />
            </div>
          </div>

          {/* Right Side: Log terminal output */}
          <div className="lg:col-span-12 xl:col-span-3">
            <EventTimeline events={events} />
          </div>

        </div>

        {/* Bottom Section: Chart Telemetry Graphs */}
        <section className="flex flex-col gap-4 border-t border-slate-800/60 pt-6 mt-2">
          <div className="flex items-center gap-2 mb-1">
            <LayoutGrid className="w-5 h-5 text-tank-cyan" />
            <h3 className="text-sm font-semibold tracking-wider uppercase font-mono text-slate-400 m-0">
              Historical Diagnostics (SCADA Analytics)
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <WaterLevelChart data={levelHistory} />
            <MotorActivityChart data={motorHistory} />
            <DailyUsageChart data={dailyUsage} />
          </div>
        </section>

      </main>

      {/* Industrial Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/40 py-4 px-6 text-center text-[10px] font-mono text-slate-600">
        FPGA Digital Twin Console v1.0.0 • Zynq-7000 SoC AP-HMI Interface • Local Telemetry Sim Active
      </footer>
    </div>
  );
};
