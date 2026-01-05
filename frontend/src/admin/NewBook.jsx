import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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

  const handleChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  const handleFile = (e) => setImageFile(e.target.files[0] || null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      toast.error("Please select an image");
      return;
    }

    try {
      setLoading(true);
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("author", form.author);
      fd.append("publishedDate", Number(form.publishedDate));
      fd.append("publication", form.publication);
      fd.append("description", form.description);
      fd.append("image", imageFile);

      const res = await fetch(
        "http://localhost:8000/api/v1/library/registerbook",
        {
          method: "POST",
          credentials: "include",
          body: fd,
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);

      toast.success("Book added successfully!");
      navigate("/admin-dashboard/books");
    } catch (err) {
      toast.error(err.message || "Failed to create book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      
      <div className="mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">
          Add New Book
        </h2>
        <p className="text-sm text-gray-500">
          Fill in the details below to register a new book
        </p>
      </div>

      
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
          
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Book Title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter book title"
              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

         
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Author
            </label>
            <input
              name="author"
              value={form.author}
              onChange={handleChange}
              placeholder="Author name"
              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Published Year
            </label>
            <input
              type="number"
              name="publishedDate"
              value={form.publishedDate}
              onChange={handleChange}
              placeholder="e.g. 2024"
              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

       
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Publication
            </label>
            <input
              name="publication"
              value={form.publication}
              onChange={handleChange}
              placeholder="Publication name"
              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

    
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Book Cover Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="w-full border rounded-lg p-2 focus:outline-none"
              required
            />
          </div>

       
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              placeholder="Short description about the book"
              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

         
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium
                         hover:bg-blue-700 transition disabled:bg-blue-300"
            >
              {loading ? "Creating..." : "Create Book"}
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={loading}
              className="px-6 py-2.5 rounded-lg bg-gray-100 text-gray-700
                         hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewBook;
