import { useState, useEffect } from 'react';
import type { TankEvent } from '../types';
import { getEvents } from '../services/api';

export const useEvents = (pollInterval = 3000) => {
  const [events, setEvents] = useState<TankEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let timerId: ReturnType<typeof setInterval>;

    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        if (active) {
          setEvents(data);
          setError(null);
        }
      } catch (err: any) {
        if (active) {
          setError(err.message || 'Failed to fetch events');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    fetchEvents();
    timerId = setInterval(fetchEvents, pollInterval);

    return () => {
      active = false;
      clearInterval(timerId);
    };
  }, [pollInterval]);

  return { events, isLoading, error };
};
