import { useState, useEffect } from 'react';
import type { WaterLevelHistoryPoint, MotorActivityPoint, DailyWaterUsagePoint, TankStatus } from '../types';

export const useChartData = (status: TankStatus | null) => {
  const [levelHistory, setLevelHistory] = useState<WaterLevelHistoryPoint[]>([]);
  const [motorHistory, setMotorHistory] = useState<MotorActivityPoint[]>([]);
  const [dailyUsage, setDailyUsage] = useState<DailyWaterUsagePoint[]>([]);

  // Initialize historical data
  useEffect(() => {
    const now = Date.now();
    const mockLevelHist: WaterLevelHistoryPoint[] = [];
    const mockMotorHist: MotorActivityPoint[] = [];
    
    // Generate 20 historical points for level and motor activity
    for (let i = 20; i >= 1; i--) {
      const time = new Date(now - i * 5000);
      const timeStr = time.toTimeString().split(' ')[0];
      
      // Create a wave pattern to look realistic
      const mockLevel = Math.round(45 + Math.sin(i / 3) * 20 + Math.random() * 3);
      mockLevelHist.push({ timestamp: timeStr, level: mockLevel });
      mockMotorHist.push({ timestamp: timeStr, active: mockLevel < 50 ? 1 : 0 });
    }

    setLevelHistory(mockLevelHist);
    setMotorHistory(mockMotorHist);

    // Initial 7-day usage
    const mockDaily: DailyWaterUsagePoint[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now - i * 24 * 60 * 60 * 1000);
      const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
      mockDaily.push({
        date: dateStr,
        usage: Math.round(1200 + Math.random() * 800), // in Liters
      });
    }
    setDailyUsage(mockDaily);
  }, []);

  // Append new data point when status updates
  useEffect(() => {
    if (!status) return;

    const timeStr = new Date().toTimeString().split(' ')[0];

    setLevelHistory((prev) => {
      const updated = [...prev, { timestamp: timeStr, level: status.level }];
      if (updated.length > 20) {
        return updated.slice(updated.length - 20);
      }
      return updated;
    });

    setMotorHistory((prev) => {
      const updated = [...prev, { timestamp: timeStr, active: status.motor ? 1 : 0 }];
      if (updated.length > 20) {
        return updated.slice(updated.length - 20);
      }
      return updated;
    });

    // Update today's usage if the motor is active (filling/draining represents throughput)
    if (status.motor || status.state === 'DRAINING') {
      setDailyUsage((prev) => {
        if (prev.length === 0) return prev;
        const updated = [...prev];
        const lastIdx = updated.length - 1;
        const addedUsage = status.motor ? 4.2 : 5.1; // simulated flow rates in liters per update
        updated[lastIdx] = {
          ...updated[lastIdx],
          usage: Math.round(updated[lastIdx].usage + addedUsage),
        };
        return updated;
      });
    }
  }, [status]);

  return { levelHistory, motorHistory, dailyUsage };
};
