import { useState, useEffect } from 'react';
import type { TankStatistics } from '../types';
import { getStatistics } from '../services/api';

export const useStatistics = (pollInterval = 5000) => {
  const [statistics, setStatistics] = useState<TankStatistics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let timerId: ReturnType<typeof setInterval>;

    const fetchStats = async () => {
      try {
        const data = await getStatistics();
        if (active) {
          setStatistics(data);
          setError(null);
        }
      } catch (err: any) {
        if (active) {
          setError(err.message || 'Failed to fetch statistics');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    fetchStats();
    timerId = setInterval(fetchStats, pollInterval);

    return () => {
      active = false;
      clearInterval(timerId);
    };
  }, [pollInterval]);

  return { statistics, isLoading, error };
};
