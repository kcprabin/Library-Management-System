import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Studentsidebar from '../componets/dashboard/Studentsidebar';
import Navbar from '../componets/dashboard/Navbar';
import BackgroundComponent from '../componets/dashboard/Background';

const StudentDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen">
      {/* Background Component - Fixed */}
      <BackgroundComponent />
      
   
      <div className="flex relative z-20 min-h-screen">
        <Studentsidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col ml-0 lg:ml-64">
          <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 p-4 lg:p-6 overflow-auto bg-black bg-opacity-0  bg-transparent">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;