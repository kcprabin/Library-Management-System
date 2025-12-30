import React from 'react';
import SearchBar from '../componets/dashboard/SearchBar';
function AdminBooks() {
  return (
    <div className="p-6">
    <div className="ml-64 mt-12 min-h-screen bg-gray-100 px-8">
      <div className="bg-white rounded-lg shadow p-4">
        <SearchBar/>
      </div>
    </div>
  </div>
  );
}

export default AdminBooks;