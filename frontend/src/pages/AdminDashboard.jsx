import React from 'react'
import { Outlet } from 'react-router-dom'
import Adminsidebar from '../componets/dashboard/Adminsidebar'
import Navbar from '../componets/dashboard/Navbar'
const AdminDashboard = () => {
  return (
    <div className='flex'>
      <Adminsidebar />
      <div className='flex-1 ml-64 bg-gray-100 min-h-screen'>
        <Navbar/> 
        
          
        
        <div className='p-6'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard