import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaBell, FaSearch, FaUserCircle } from 'react-icons/fa';
import axios from 'axios';
import { getUser } from '../../fetch';

const BACKEND = import.meta.env.VITE_BACKEND;

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [email,setEmail] =useState('');
  const [userName, setUserName] = useState();
  const [showProfile, setShowProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
  const fetchUserData = async () => {
    try {
      const response = await getUser(); 
      
      
      if (response && response.success && response.user) {
        const userData = response.user;
        
        setRole(userData.role);
        setEmail(userData.email);
        
        
        if (userData.role === 'admin') {
          setUserName(userData.name);
        } else {
          setUserName(userData.name);
        }
      }
    } catch (error) {
      console.error("Auth failed:", error);
     
    } finally {
      setIsLoading(false);
    }
  };

  fetchUserData();
}, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${BACKEND}/api/v1/library/logout`,
        {},
        { withCredentials: true }
      );
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className='sticky top-0 z-30 flex items-center justify-between h-20 px-4 lg:px-8 bg-white border-b border-gray-100 shadow-sm'>
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
        >
          <FaBars className="w-5 h-5" />
        </button>
        
        <div className="hidden lg:block">
          <h2 className="text-xl font-bold text-gray-900">Welcome back!</h2>
          <p className="text-sm text-gray-500">Here's what's happening today</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search Bar - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 transition-all w-64">
          <FaSearch className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 w-full"
          />
        </div>

        

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 p-2 pr-3 hover:bg-gray-50 rounded-xl transition-all"
          >
           <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-semibold shadow-sm">
  
           {userName?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-sm font-semibold text-gray-900">{userName || "Loading..."}</p>
            <p className="text-xs text-gray-500 capitalize">{role}</p>
          </div>
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <p className="font-semibold text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500 mt-0.5">{email}</p>
              </div>
              <div className="p-2">
                <button 
                  onClick={() => {
                    navigate('/profile-settings');
                    setShowProfile(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-all"
                >
                  Profile Settings
                </button>
                <button 
                  onClick={() => {
                    navigate('/account-settings');
                    setShowProfile(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-all"
                >
                  Account Settings
                </button>
                <button 
                  onClick={() => {
                    navigate('/help-support');
                    setShowProfile(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-all"
                >
                  Help & Support
                </button>
              </div>
              <div className="p-2 border-t border-gray-100">
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;