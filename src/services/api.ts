import axios from 'axios';
import type { TankStatus, TankStatistics, TankEvent } from '../types';

// Read API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || '';

// Determine if we should use mock data or real API calls.
const isMock = !API_URL;

// Axios instance configured with base URL and timeout
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ----------------------------------------------------
// INTERACTIVE MOCK STATE SIMULATION (for local dev)
// ----------------------------------------------------

const DEFAULT_STATUS: TankStatus = {
  level: 55,
  motor: false,
  mode: 'AUTO',
  state: 'IDLE',
  alarm: false,
  fillCount: 12,
  drainCount: 7,
  overflowCount: 0,
  errorCount: 0,
  uptime: '00:00:00',
};

const INITIAL_EVENTS: TankEvent[] = [
  { id: '1', timestamp: '21:10:15', message: 'System Initialized.', type: 'info' },
  { id: '2', timestamp: '21:12:00', message: 'Mode switched to AUTO.', type: 'info' },
  { id: '3', timestamp: '21:12:05', message: 'Water level below 20%. Motor ON.', type: 'success' },
  { id: '4', timestamp: '21:15:20', message: 'Water level reached 90%. Motor OFF.', type: 'info' },
];

// Helper to get formatted time
const getFormattedTime = (): string => {
  const now = new Date();
  return now.toTimeString().split(' ')[0];
};

// Local storage keys
const STATE_KEY = 'watertank_sim_state';
const EVENTS_KEY = 'watertank_sim_events';
const BOOT_TIME_KEY = 'watertank_sim_boot_time';

// Initialize simulation state
const initSim = () => {
  if (!localStorage.getItem(BOOT_TIME_KEY)) {
    localStorage.setItem(BOOT_TIME_KEY, Date.now().toString());
  }
  if (!localStorage.getItem(STATE_KEY)) {
    localStorage.setItem(STATE_KEY, JSON.stringify(DEFAULT_STATUS));
  }
  if (!localStorage.getItem(EVENTS_KEY)) {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(INITIAL_EVENTS));
  }
};

initSim();

// Calculate uptime
const getUptime = (): string => {
  const bootTime = parseInt(localStorage.getItem(BOOT_TIME_KEY) || '0', 10);
  const diffMs = Date.now() - bootTime;
  const secs = Math.floor(diffMs / 1000) % 60;
  const mins = Math.floor(diffMs / (1000 * 60)) % 60;
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  
  const pad = (num: number) => num.toString().padStart(2, '0');
  return `${pad(hours)}:${pad(mins)}:${pad(secs)}`;
};

// Retrieve states from local storage
const getSimStatus = (): TankStatus => {
  const status = JSON.parse(localStorage.getItem(STATE_KEY) || JSON.stringify(DEFAULT_STATUS));
  status.uptime = getUptime();
  return status;
};

const setSimStatus = (status: TankStatus) => {
  localStorage.setItem(STATE_KEY, JSON.stringify(status));
};

const getSimEvents = (): TankEvent[] => {
  return JSON.parse(localStorage.getItem(EVENTS_KEY) || JSON.stringify(INITIAL_EVENTS));
};

const addSimEvent = (message: string, type: 'info' | 'warning' | 'error' | 'success') => {
  const events = getSimEvents();
  const newEvent: TankEvent = {
    id: Date.now().toString(),
    timestamp: getFormattedTime(),
    message,
    type,
  };
  // Prepend so that newest is on top
  const updatedEvents = [newEvent, ...events].slice(0, 100); // limit to 100
  localStorage.setItem(EVENTS_KEY, JSON.stringify(updatedEvents));
};

// Simulate physics and controller logic
const runSimulationStep = () => {
  const status = getSimStatus();
  let updated = false;

  // Passive water consumption (slowly drains at all times unless filling/draining manually)
  const passiveUsageRate = 0.05; // % per step
  
  if (status.state === 'FILLING') {
    const fillRate = status.mode === 'MANUAL' ? 1.5 : 1.2;
    status.level = Math.min(100, status.level + fillRate);
    updated = true;
  } else if (status.state === 'DRAINING') {
    const drainRate = status.mode === 'MANUAL' ? 1.8 : 1.5;
    status.level = Math.max(0, status.level - drainRate);
    updated = true;
  } else {
    // IDLE state slowly drains
    if (status.level > 0 && status.level < 100) {
      status.level = Math.max(0, status.level - passiveUsageRate);
      updated = true;
    }
  }

  // Automatic feedback loop (HMI/SCADA Controller)
  if (status.mode === 'AUTO' && status.state !== 'ERROR') {
    if (status.level <= 15 && status.state !== 'FILLING') {
      status.motor = true;
      status.state = 'FILLING';
      status.fillCount += 1;
      addSimEvent('Water level low (<= 15%). Auto-filling started.', 'warning');
      updated = true;
    } else if (status.level >= 90 && status.state === 'FILLING') {
      status.motor = false;
      status.state = 'FULL';
      addSimEvent('Water level high (>= 90%). Auto-fill stopped. Tank FULL.', 'success');
      updated = true;
    } else if (status.level >= 95 && !status.alarm) {
      status.alarm = true;
      status.overflowCount += 1;
      addSimEvent('Critical high water level! Overflow alarm triggered.', 'error');
      updated = true;
    } else if (status.level < 90 && status.state === 'FULL') {
      status.state = 'IDLE';
      updated = true;
    } else if (status.level < 15 && status.state !== 'FILLING') {
      status.state = 'LOW';
      updated = true;
    } else if (status.level === 0 && status.state !== 'EMPTY') {
      status.state = 'EMPTY';
      updated = true;
    }
  } else {
    // Manual behavior and alarm triggers
    if (status.level >= 98 && !status.alarm) {
      status.alarm = true;
      status.state = 'OVERFLOW';
      status.overflowCount += 1;
      status.motor = false; // Emergency trip
      addSimEvent('OVERFLOW! Emergency shutdown of motor.', 'error');
      updated = true;
    } else if (status.level === 0 && status.motor === false && status.state !== 'EMPTY') {
      status.state = 'EMPTY';
      updated = true;
    } else if (status.level < 15 && status.motor === false && status.state !== 'LOW' && status.state !== 'EMPTY') {
      status.state = 'LOW';
      updated = true;
    } else if (status.level >= 90 && status.level < 98 && status.state !== 'FULL') {
      status.state = 'FULL';
      updated = true;
    }
  }

  // Clear alarm if level is back to normal
  if (status.alarm && status.level < 90 && status.state !== 'ERROR') {
    status.alarm = false;
    addSimEvent('Water level returned to safe parameters. Alarm cleared.', 'info');
    updated = true;
  }

  if (updated) {
    // Clean up float rounding
    status.level = Math.round(status.level * 10) / 10;
    setSimStatus(status);
  }
};

// ----------------------------------------------------
// PUBLIC API INTERFACE
// ----------------------------------------------------

export const getTankStatus = async (): Promise<TankStatus> => {
  if (isMock) {
    runSimulationStep();
    return getSimStatus();
  }
  const response = await apiClient.get<TankStatus>('/api/status');
  return response.data;
};

export const fillTank = async (): Promise<void> => {
  if (isMock) {
    const status = getSimStatus();
    if (status.state === 'ERROR') return;
    status.motor = true;
    status.state = 'FILLING';
    status.fillCount += 1;
    setSimStatus(status);
    addSimEvent('Manual filling triggered.', 'info');
    return;
  }
  await apiClient.post('/api/fill');
};

export const drainTank = async (): Promise<void> => {
  if (isMock) {
    const status = getSimStatus();
    if (status.state === 'ERROR') return;
    status.motor = false;
    status.state = 'DRAINING';
    status.drainCount += 1;
    setSimStatus(status);
    addSimEvent('Manual draining triggered.', 'info');
    return;
  }
  await apiClient.post('/api/drain');
};

export const resetTank = async (): Promise<void> => {
  if (isMock) {
    const status = getSimStatus();
    status.alarm = false;
    status.state = 'IDLE';
    status.motor = false;
    setSimStatus(status);
    addSimEvent('System reset command executed.', 'info');
    return;
  }
  await apiClient.post('/api/reset');
};

export const setAutoMode = async (): Promise<void> => {
  if (isMock) {
    const status = getSimStatus();
    status.mode = 'AUTO';
    setSimStatus(status);
    addSimEvent('System switched to AUTO mode.', 'info');
    return;
  }
  await apiClient.post('/api/auto');
};

export const setManualMode = async (): Promise<void> => {
  if (isMock) {
    const status = getSimStatus();
    status.mode = 'MANUAL';
    // When switching to manual, stop active automated fill/drain unless user triggers it
    if (status.state === 'FILLING' || status.state === 'DRAINING') {
      status.state = 'IDLE';
      status.motor = false;
    }
    setSimStatus(status);
    addSimEvent('System switched to MANUAL mode.', 'info');
    return;
  }
  await apiClient.post('/api/manual');
};

export const emergencyStop = async (): Promise<void> => {
  if (isMock) {
    const status = getSimStatus();
    status.motor = false;
    status.state = 'ERROR';
    status.alarm = true;
    status.errorCount += 1;
    setSimStatus(status);
    addSimEvent('EMERGENCY STOP PRESSED! System entered safe-mode error state.', 'error');
    return;
  }
  await apiClient.post('/api/stop');
};

export const getStatistics = async (): Promise<TankStatistics> => {
  if (isMock) {
    const status = getSimStatus();
    return {
      level: status.level,
      motor: status.motor,
      mode: status.mode,
      state: status.state,
      fillCount: status.fillCount,
      drainCount: status.drainCount,
      overflowCount: status.overflowCount,
      errorCount: status.errorCount,
      uptime: status.uptime,
      avgLevel: 52.4, // Mock stats
      waterProcessed: status.fillCount * 250, // assume 250 Liters per fill
      efficiency: 98.2,
    };
  }
  const response = await apiClient.get<TankStatistics>('/api/stats');
  return response.data;
};

export const getEvents = async (): Promise<TankEvent[]> => {
  if (isMock) {
    return getSimEvents();
  }
  const response = await apiClient.get<TankEvent[]>('/api/events');
  return response.data;
};
