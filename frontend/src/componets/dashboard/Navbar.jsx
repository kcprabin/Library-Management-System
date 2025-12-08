import React from 'react'
import { useAuth } from '../../context/authcontext'
import axios from 'axios'

const Navbar = () => {
  const { user, logout } = useAuth()
  
  return (
    <div className='flex items-center justify-between h-12 bg-teal-600 px-6 text-white shadow-md'>
      <p className='text-lg font-semibold'>Welcome, {user?.name || 'Admin'}</p>
      <button 
        onClick={logout}
        className='bg-teal-700 hover:bg-teal-800 px-4 py-2 rounded-md transition-colors duration-200'
      >
        Logout
      </button>
    </div>
  )
}

export default Navbar