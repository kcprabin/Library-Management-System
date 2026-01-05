
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function AdminBooks() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({
    title: "",
    author: "",
    publishedDate: "",
    publication: "",
    description: "",
    image: "",
  });

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/api/v1/library/getbooks", { credentials: 'include' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data && data.Books) setBooks(data.Books);
      else setError("Unexpected response format");
    } catch (err) {
      setError(err.message || "Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/api/v1/library/registerbook", {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      // assume created book is in data.Books[0] or data.book
      if (data && data.Books && data.Books.length > 0) {
        setBooks((b) => [data.Books[0], ...b]);
      } else if (data && data.book) {
        setBooks((b) => [data.book, ...b]);
      } else {
        // fallback: refetch
        await fetchBooks();
      }
      setShowForm(false);
      setForm({ title: "", author: "", publishedDate: "", publication: "", description: "", image: "" });
    } catch (err) {
      setError(err.message || "Failed to create book");
    }
  };
  const filteredBooks = books.filter(book => 
  book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  book.author.toLowerCase().includes(searchTerm.toLowerCase())
);

  return (
    <div className="p-6">


      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-white">Books Management</h1>
        
        <div>
          <button
            onClick={() => { const nav = navigate; nav('/new-book'); }}
            className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            title="Add book"
          >
            <span className="text-lg font-bold mr-2">+</span>
            Add Book
          </button>
        </div>
      </div>
      <div className="mb-4 text-white">
          <input
            type="text"
            placeholder ="Search books by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2         focus:ring-blue-500 "
          />
        </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="border p-2 rounded" required />
            <input name="author" value={form.author} onChange={handleChange} placeholder="Author" className="border p-2 rounded" required />
            <input name="publishedDate" value={form.publishedDate} onChange={handleChange} placeholder="Published Year" className="border p-2 rounded" />
            <input name="publication" value={form.publication} onChange={handleChange} placeholder="Publication" className="border p-2 rounded" />
            <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" className="border p-2 rounded col-span-1 md:col-span-2" />
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="border p-2 rounded col-span-1 md:col-span-2" />
            <div className="col-span-1 md:col-span-2 flex gap-2">
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Create</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-4">
        {loading && <p>Loading books...</p>}
        {error && <p className="text-red-600">Error: {error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBooks.map((b) => (
              <div key={b._id} className="border rounded-lg shadow-sm p-4 bg-white">
                {b.image && (
                  <img src={b.image} alt={b.title} className="w-full h-40 object-cover rounded mb-3" />
                )}
                <h3 className="font-semibold text-lg mb-1">{b.title}</h3>
                <p className="text-sm text-gray-600">{b.author} · {b.publication}</p>
                {b.description && <p className="mt-2 text-sm text-gray-700">{b.description}</p>}
                <p className="mt-3 text-xs text-gray-400">{b.publishedDate || (b.createdAt ? new Date(b.createdAt).toLocaleDateString() : '')}</p>
              </div>
            ))}
          {filteredBooks.length === 0 && (<p className="mt-2 col-span-full">{searchTerm ? `No books found matching "${searchTerm}"` : 'No books found.'}</p>)}
          </div>
        )}

      </div>
    </div>
  
  );
}

export default AdminBooks;