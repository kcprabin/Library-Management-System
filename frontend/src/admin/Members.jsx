import React, { useEffect, useState } from "react";

function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "http://localhost:8000/api/v1/library/members",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (res.status === 401) {
          setError("Unauthorized (401). Please login.");
          return;
        }
        if (res.status === 403) {
          setError("Forbidden (403). Insufficient permissions.");
          return;
        }

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data?.users) setMembers(data.users);
        else if (data?.user) setMembers(data.user);
        else setError("Unexpected response format");
      } catch (err) {
        setError(err.message || "Failed to fetch members");
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this member?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/library/members/${id}`,//delete member ko APi
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Failed to delete member");

      // remove from UI
      setMembers((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-white">
          Members Management
        </h1>
        <p className="text-sm text-white">
          View and manage registered library members
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-gray-100">
        {loading && (
          <div className="p-8 text-center text-gray-500">
            Loading members...
          </div>
        )}

        {error && (
          <div className="p-6 text-center text-red-600 font-medium">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {members.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No members found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-4 text-left">Email</th>
                      <th className="px-6 py-4 text-left">Role</th>
                      <th className="px-6 py-4 text-left">Created</th>
                      <th className="px-6 py-4 text-left">Updated</th>
                      <th className="px-6 py-4 text-center">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    {members.map((m) => (
                      <tr
                        key={m._id}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4">
                          {m.studentemail || "-"}
                        </td>

                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            {m.role || "N/A"}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {new Date(m.createdAt).toLocaleString()}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {new Date(m.updatedAt).toLocaleString()}
                        </td>

                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleDelete(m._id)}
                            className="px-4 py-1.5 text-xs font-medium rounded-lg 
                                       bg-red-100 text-red-600 hover:bg-red-200
                                       transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Members;
