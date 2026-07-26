export interface TankStatus {
  level: number; // 0 to 100
  motor: boolean; // true = ON / running, false = OFF / stopped
  mode: 'AUTO' | 'MANUAL';
  state: 'IDLE' | 'FILLING' | 'DRAINING' | 'FULL' | 'LOW' | 'EMPTY' | 'OVERFLOW' | 'ERROR';
  alarm: boolean;
  fillCount: number;
  drainCount: number;
  overflowCount: number;
  errorCount: number;
  uptime: string; // e.g., "02:35:20"
}

export interface TankStatistics {
  level: number;
  motor: boolean;
  mode: 'AUTO' | 'MANUAL';
  state: string;
  fillCount: number;
  drainCount: number;
  overflowCount: number;
  errorCount: number;
  uptime: string;
  avgLevel: number;
  waterProcessed: number; // Total Liters processed
  efficiency: number; // percentage
}

export interface TankEvent {
  id: string;
  timestamp: string; // HH:mm:ss
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

export interface WaterLevelHistoryPoint {
  timestamp: string;
  level: number;
}

export interface MotorActivityPoint {
  timestamp: string;
  active: number; // 0 or 1
}

export interface DailyWaterUsagePoint {
  date: string;
  usage: number; // in Liters
}
