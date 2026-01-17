import { useState, useEffect, useRef, useCallback } from 'react';

export interface BentleyStats {
  wins: number;
  losses: number;
  total: number;
  winRate: number;
  bentleyWinRate: number;
  date: string;
}

export function useBentleyStats() {
  const [stats, setStats] = useState<BentleyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchStats = useCallback(async () => {
    // Abort any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      setLoading(true);
      const response = await fetch('https://www.mcooper.com/api/bentley-stats.php', { signal });

      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      const data = await response.json();

      if (data.success) {
        setStats({
          wins: data.wins,
          losses: data.losses,
          total: data.total,
          winRate: data.winRate,
          bentleyWinRate: data.bentleyWinRate,
          date: data.date
        });
      } else {
        throw new Error('Invalid response from API');
      }
    } catch (err) {
      // Don't update state if the request was aborted
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }

      setError(err instanceof Error ? err.message : 'Unknown error');

      // Set mock data for development/testing
      setStats({
        wins: 0,
        losses: 0,
        total: 0,
        winRate: 0,
        bentleyWinRate: 0,
        date: new Date().toISOString().split('T')[0]
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();

    // Cleanup: abort any pending request on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchStats]);

  const recordWin = async () => {
    try {
      await fetch('https://www.mcooper.com/api/bentley-win.php');
      await fetchStats(); // Refresh stats
    } catch {
      // Silent fail for API errors - non-critical functionality
    }
  };

  const recordLoss = async () => {
    try {
      await fetch('https://www.mcooper.com/api/bentley-loss.php');
      await fetchStats(); // Refresh stats
    } catch {
      // Silent fail for API errors - non-critical functionality
    }
  };

  return {
    stats,
    loading,
    error,
    recordWin,
    recordLoss,
    refresh: fetchStats
  };
}
