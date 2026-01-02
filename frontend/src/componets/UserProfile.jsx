import React, { useState, useEffect } from 'react';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    borrowed: 0,
    returned: 0,
    overdue: 0
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
   try{
      
      // Calculate stats
      const borrowed = historyData.books.filter(b => b.status === 'ISSUED').length;
      const returned = historyData.books.filter(b => b.status === 'RETURNED').length;
      const overdue = historyData.books.filter(b => 
        b.status === 'ISSUED' && new Date() > new Date(b.dueDate)
      ).length;

      setStats({ borrowed, returned, overdue });
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  };

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {user.studentemail[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.studentemail}</h1>
            <p className="text-gray-600 capitalize">{user.role}</p>
            <p className="text-sm text-gray-500">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-3xl font-bold text-blue-600">{stats.borrowed}</p>
            <p className="text-gray-600">Currently Borrowed</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-3xl font-bold text-green-600">{stats.returned}</p>
            <p className="text-gray-600">Returned</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <p className="text-3xl font-bold text-red-600">{stats.overdue}</p>
            <p className="text-gray-600">Overdue</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;