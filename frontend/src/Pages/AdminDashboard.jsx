import React from 'react'
import Adminsidebar from '../componets/dashboard/Adminsidebar'
import Navbar from '../componets/dashboard/Navbar'
import Content from '../componets/dashboard/Content'

function AdminDashboard() {
  return (
    <div>
      {/* Sidebar */}
      <Adminsidebar />

      {/* Main Content Area */}
      <div>
        <Navbar />
        <Content />
      </div>
    </div>
  )
}

export default AdminDashboard