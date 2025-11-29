import { useState, useEffect } from 'react';

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

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://www.mcooper.com/api/bentley-stats.php');

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
      console.error('Error fetching Bentley stats:', err);
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
  };

  const recordWin = async () => {
    try {
      await fetch('https://www.mcooper.com/api/bentley-win.php');
      await fetchStats(); // Refresh stats
    } catch (err) {
      console.error('Error recording win:', err);
    }
  };

  const recordLoss = async () => {
    try {
      await fetch('https://www.mcooper.com/api/bentley-loss.php');
      await fetchStats(); // Refresh stats
    } catch (err) {
      console.error('Error recording loss:', err);
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
