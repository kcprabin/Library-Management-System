import { useState, useEffect } from 'react';

const BACKEND = import.meta.env.VITE_BACKEND;

export const useDashboardStats = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalBooks: 0,
    booksIssued: 0,
    booksReturned: 0,
    booksNotReturned: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${BACKEND}/api/v1/library/dashboard-stats`, {
          credentials: 'include'
        });

        if (!response.ok) throw new Error('Failed to fetch stats');

        const data = await response.json();

        setStats({
          totalMembers: data.stats.totalMembers,
          totalBooks: data.stats.totalBooks,
          booksIssued: data.stats.issuedBooks,
          booksReturned: data.stats.returnedBooks,
          booksNotReturned: data.stats.overdueBooks
        });

      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError(err.message || 'Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error, refetch: () => window.location.reload() };
};