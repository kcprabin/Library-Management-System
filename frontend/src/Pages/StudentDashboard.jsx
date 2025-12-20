import React, { Component } from 'react'
import Studentsidebar from '../componets/dashboard/Studentsidebar'
import Navbar from '../componets/dashboard/Navbar'
import Content from '../componets/dashboard/Content'

const StudentDashboard = () => {
  return (
    <div>
      <Studentsidebar/>
      <div >
        <Navbar/>
        <div>
          <Content/>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
