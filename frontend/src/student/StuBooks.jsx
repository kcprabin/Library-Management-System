import React from 'react'

const StuBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:8000/api/v1/library/getbooks', { credentials: 'include' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data && data.Books) setBooks(data.Books);
        else setError('Unexpected response format');
      } catch (err) {
        setError(err.message || 'Failed to fetch books');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  return (
    <div>
      stuedent's books
    </div>
  );
};

export default StuBooks
