import React, { useEffect, useState } from "react";
import { FaSearch, FaUserCircle, FaTrash, FaSpinner, FaFilter } from "react-icons/fa";



function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all'); // 'all', 'admin', 'student'
  const [showMobileCards, setShowMobileCards] = useState(window.innerWidth < 768);

  useEffect(() => {
    fetchMembers();
    
    // Handle responsive view
    const handleResize = () => {
      setShowMobileCards(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/api/v1/library/members", {
        method: "GET",
        credentials: "include",
      });

      if (res.status === 401) {
        setError("Unauthorized. Please login.");
        return;
      }
      if (res.status === 403) {
        setError("Forbidden. Insufficient permissions.");
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

  const handleDelete = async (id, email) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete member "${email}"? This action cannot be undone.`
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/library/members/${id}`,
        { method: "DELETE", credentials: "include" }
      );

      if (!res.ok) throw new Error("Failed to delete member");
      
      // Remove from UI
      setMembers((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  };

 
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.studentemail?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

 
  const getInitials = (email) => {
    if (!email) return '?';
    return email.charAt(0).toUpperCase();
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <FaSpinner className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium">Loading members...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-red-800">Error loading members</h3>
              <p className="mt-2 text-sm text-red-700">{error}</p>
              <button 
                onClick={fetchMembers}
                className="mt-3 text-sm font-medium text-red-600 hover:text-red-500"
              >
                Try again →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Members Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage registered library members
        </p>
      </div>

 
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg 
                       focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                       text-gray-900 placeholder-gray-400"
          />
        </div>

       
        <div className="sm:w-48">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaFilter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                         text-gray-900 bg-white appearance-none cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="student">Student</option>
            </select>
          </div>
        </div>
      </div>

     
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 border border-indigo-200">
          <p className="text-sm font-medium text-indigo-600">Total Members</p>
          <p className="text-2xl font-bold text-indigo-900 mt-1">{members.length}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <p className="text-sm font-medium text-purple-600">Admins</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">
            {members.filter(m => m.role === 'admin').length}
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-sm font-medium text-blue-600">Students</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">
            {members.filter(m => m.role === 'student').length}
          </p>
        </div>
      </div>

      
      {filteredMembers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
          <FaUserCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No members found</h3>
          <p className="text-gray-500">
            {searchTerm || roleFilter !== 'all'
              ? "No members match your search criteria."
              : "No members have registered yet."
            }
          </p>
        </div>
      ) : showMobileCards ? (
        // Mobile Card View
        <div className="space-y-4">
          {filteredMembers.map((member) => (
            <div key={member._id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 
                                  rounded-full flex items-center justify-center text-white font-semibold">
                    {getInitials(member.studentemail)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{member.studentemail}</p>
                    <span className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full
                      ${member.role === 'admin' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-blue-100 text-blue-700'}`}>
                      {member.role}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 mb-3">
                <p>Created: {new Date(member.createdAt).toLocaleDateString()}</p>
                <p>Updated: {new Date(member.updatedAt).toLocaleDateString()}</p>
              </div>

              <button
                onClick={() => handleDelete(member._id, member.studentemail)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 
                           bg-red-50 text-red-600 rounded-lg hover:bg-red-100 
                           transition-colors text-sm font-medium"
              >
                <FaTrash className="w-3.5 h-3.5" />
                Delete Member
              </button>
            </div>
          ))}
        </div>
      ) : (
        // Desktop Table View
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMembers.map((member, idx) => (
                  <tr 
                    key={member._id} 
                    className={`hover:bg-gray-50 transition-colors ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 
                                          flex items-center justify-center text-white font-semibold">
                            {getInitials(member.studentemail)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {member.studentemail}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full
                        ${member.role === 'admin' 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-blue-100 text-blue-700'}`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(member.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(member.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(member._id, member.studentemail)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 
                                   bg-red-50 text-red-600 rounded-lg hover:bg-red-100 
                                   transition-colors text-sm font-medium"
                      >
                        <FaTrash className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Results count */}
      {filteredMembers.length > 0 && (
        <div className="mt-4 text-sm text-gray-600 text-center">
          Showing {filteredMembers.length} of {members.length} members
        </div>
      )}
    </div>
  );
}

export default Members;