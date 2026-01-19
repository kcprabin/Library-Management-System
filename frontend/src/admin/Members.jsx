import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaUserCircle, FaTrash, FaSpinner, FaFilter, FaUserPlus, FaDownload } from "react-icons/fa";
import toast from "react-hot-toast";

const BACKEND = import.meta.env.VITE_BACKEND || "http://localhost:8000";

function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showMobileCards, setShowMobileCards] = useState(window.innerWidth < 768);
  const navigate = useNavigate()

  useEffect(() => {
    fetchMembers();
    
    const handleResize = () => {
      setShowMobileCards(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const addMember = ()=>{
    navigate("/register")
  }

  const handleExport = () => {
    try {
      const csv = [
        ['Email', 'Name', 'Role', 'Registration Date'],
        ...members.map(m => [
          m.studentemail,
          m.name || 'N/A',
          m.role,
          m.createdAt ? new Date(m.createdAt).toLocaleDateString() : 'N/A'
        ])
      ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `members_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast.success('Members exported successfully!');
    } catch (err) {
      toast.error('Failed to export members');
    }
  };

 
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND}/api/v1/library/members`, {
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
        `${BACKEND}/api/v1/library/deleteuser/${email}`,
        { method: "DELETE", credentials: "include" }
      );
      console.log(email)

      if (!res.ok) throw new Error("Failed to delete member");
      
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

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
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
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-medium text-sm"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Members Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage registered library members
          </p>
        </div>
        
        <div className="flex gap-3">
          <button onClick={handleExport} className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all shadow-sm">
            <FaDownload className="w-4 h-4" />
            Export
          </button>
          <button onClick={addMember} className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-sm">
            <FaUserPlus className="w-4 h-4" />
            Add Member
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Total Members</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{members.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <FaUserCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Admins</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {members.filter(m => m.role === 'admin').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Students</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {members.filter(m => m.role === 'student').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FaSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl 
                       focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                       text-gray-900 placeholder-gray-400 shadow-sm"
          />
        </div>

        <div className="sm:w-56 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FaFilter className="h-4 w-4 text-gray-400" />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl 
                       focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                       text-gray-900 bg-white appearance-none cursor-pointer shadow-sm"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="student">Student</option>
          </select>
        </div>
      </div>

      {/* Members List/Table */}
      {filteredMembers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
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
        <div className="space-y-4">
          {filteredMembers.map((member) => (
            <div key={member._id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-semibold shadow-lg shadow-indigo-500/30">
                    {getInitials(member.studentemail)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{member.studentemail}</p>
                    <span className={`inline-block mt-1 px-3 py-1 text-xs font-semibold rounded-full
                      ${member.role === 'admin' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-blue-100 text-blue-700'}`}>
                      {member.role}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4 pl-15">
                <p><span className="font-medium">Joined:</span> {new Date(member.createdAt).toLocaleDateString()}</p>
                <p><span className="font-medium">Updated:</span> {new Date(member.updatedAt).toLocaleDateString()}</p>
              </div>

              <button
                onClick={() => handleDelete(member._id, member.studentemail)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 
                           bg-red-50 text-red-600 rounded-xl hover:bg-red-100 
                           transition-all text-sm font-semibold"
              >
                <FaTrash className="w-4 h-4" />
                Delete Member
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Member
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Joined Date
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredMembers.map((member) => (
                  <tr 
                    key={member._id} 
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-11 w-11">
                          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold shadow-lg shadow-indigo-500/30">
                            {getInitials(member.studentemail)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">
                            {member.studentemail}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1.5 text-xs font-semibold rounded-full
                        ${member.role === 'admin' 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-blue-100 text-blue-700'}`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                      {new Date(member.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                      {new Date(member.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(member._id, member.studentemail)}
                        className="inline-flex items-center gap-2 px-4 py-2 
                                   bg-red-50 text-red-600 rounded-xl hover:bg-red-100 
                                   transition-all text-sm font-semibold"
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
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredMembers.length}</span> of <span className="font-semibold text-gray-900">{members.length}</span> members
          </p>
        </div>
      )}
    </div>
  );
}

export default Members;