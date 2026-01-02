import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import axios from 'axios';

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
    const [role, setRole] = useState('');
  const [userName, setUser] = useState('User');

  useEffect(() => {
   
    setUser(); 
  }, [navigate]);


  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/v1/library/logout",
        {},
        { withCredentials: true }
      );
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className='flex items-center justify-between h-20 px-4 lg:px-6 text-oklch(92.2% 0 0) shadow-none relative z-30 bg-transparent border-b border-white border-opacity-10'>
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden text-white hover:text-gray-300 transition-colors hover:bg-white hover:bg-opacity-10 p-2 rounded-lg"
        >
          <FaBars className="w-6 h-6" />
        </button>
        <div>
  <p className='text-sm text-white'>Welcome back</p>

  <p className='text-lg font-bold text-white'>
    {role === 'admin' ? 'Admin' : userName}
  </p>
</div>
      </div>

      <button 
        onClick={handleLogout}
        className='bg-red-600 hover:bg-red-700 px-6 py-2.5 rounded-lg transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105'
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;