import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Adminsidebar from '../componets/dashboard/Adminsidebar';
import Navbar from '../componets/dashboard/Navbar';
import Background from '../componets/dashboard/Background';

function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen ">
      {/* Background Component - Fixed */}
      <Background />
      
      {/* Content Overlay */}
      <div className="flex relative z-20 min-h-screen ">
        <Adminsidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col ml-0 lg:ml-64 ">
          <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 p-4 lg:p-6 overflow-auto bg-black bg-opacity-0  bg-transparent">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;