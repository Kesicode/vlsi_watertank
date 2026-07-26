import { useState, useEffect, useCallback } from 'react';
import type { TankStatus } from '../types';
import { getTankStatus } from '../services/api';

export const useTankData = (pollInterval = 2000) => {
  const [status, setStatus] = useState<TankStatus | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const data = await getTankStatus();
      setStatus(data);
      setIsConnected(true);
      setError(null);
    } catch (err: any) {
      setIsConnected(false);
      setError(err.message || 'Connection lost to controller');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    let timerId: ReturnType<typeof setInterval>;

    const tick = async () => {
      if (!active) return;
      await fetchData();
    };

    // Initial fetch
    fetchData();

    // Polling interval
    timerId = setInterval(tick, pollInterval);

    return () => {
      active = false;
      clearInterval(timerId);
    };
  }, [pollInterval, fetchData]);

  return { status, isConnected, isLoading, error, refetch: fetchData };
};
