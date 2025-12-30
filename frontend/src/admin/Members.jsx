import React, { useEffect, useState } from "react";

function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:8000/api/v1/library/members", {
          method: "GET",
          credentials: "include", // send httpOnly cookies
        });

        if (res.status === 401) {
          setError("Unauthorized (401). Please login.");
          // optionally redirect to login
          // window.location.href = '/login';
          return;
        }
        if (res.status === 403) {
          setError("Forbidden (403). Insufficient permissions.");
          return;
        }

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data && data.users) setMembers(data.users);
        else if (data && data.user) setMembers(data.user);
        else setError("Unexpected response format");
      } catch (err) {
        setError(err.message || "Failed to fetch members");
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  return (
    <div className="p-69">
      <h1 className="text-2xl font-bold mb-4">Members Management</h1>

      <div className="bg-white rounded-lg shadow p-4">
        {loading && <p>Loading members...</p>}
        {error && <p className="text-red-600">Error: {error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {members.map((m) => (
                  <tr key={m._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{m.studentemail || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{m.role || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(m.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(m.updatedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {members.length === 0 && <p className="mt-2">No members found.</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default Members;