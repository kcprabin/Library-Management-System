import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function NewBook() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    author: "",
    publishedDate: "",
    publication: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleFile = (e) => setImageFile(e.target.files[0] || null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("author", form.author);
      fd.append("publishedDate", Number(form.publishedDate));
      fd.append("publication", form.publication);
      fd.append("description", form.description);
      if (imageFile) fd.append("image", imageFile);


      const res = await fetch("http://localhost:8000/api/v1/library/registerbook", {
        method: "POST",
        credentials: 'include',
        body: fd,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await res.json();
      navigate("/admin-dashboard/books");
    } catch (err) {
      setError(err.message || "Failed to create book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Add New Book</h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3">
          <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="border p-2 rounded" required />
          <input name="author" value={form.author} onChange={handleChange} placeholder="Author" className="border p-2 rounded" required />
          <input name="publishedDate" value={form.publishedDate} onChange={handleChange} placeholder="Published Year" className="border p-2 rounded" />
          <input name="publication" value={form.publication} onChange={handleChange} placeholder="Publication" className="border p-2 rounded" />
          <input type="file" accept="image/*" onChange={handleFile} className="border p-2 rounded" />
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="border p-2 rounded" />
          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading ? 'Saving...' : 'Create'}</button>
            <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewBook;
