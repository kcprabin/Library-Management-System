import { useState, useEffect } from 'react';
import { getMembers, getBooks, getIssuedBooks } from '../fetch';

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

       
        const [membersData, booksData, issuedData] = await Promise.all([
          getMembers(),
          getBooks(),
          getIssuedBooks()
        ]);

        const members = membersData.user || membersData.users || [];
        const books = booksData.Books || booksData.book || [];
        const issuedBooks = issuedData.books || [];

        const currentlyIssued = issuedBooks.filter(book => book.status === 'ISSUED');
        const returned = issuedBooks.filter(book => book.status === 'RETURNED');
        
        const notReturned = currentlyIssued.length; 

        setStats({
          totalMembers: members.length,
          totalBooks: books.length,
          booksIssued: currentlyIssued.length,
          booksReturned: returned.length,
          booksNotReturned: 0 
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