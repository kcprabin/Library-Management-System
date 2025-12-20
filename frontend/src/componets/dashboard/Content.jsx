import React from 'react'
import { useLocation } from 'react-router-dom';

import Cards from '../../admin/Cards';
import Members from '../../admin/Members';
import Issused from '../../admin/Issused';
import AdminBooks from '../../admin/AdminBooks';
import AdminReturned from '../../admin/AdminReturned';

import StuCard from '../../student/StuCards'
import StuBooks from '../../student/StuBooks'
import StuNotReturn from '../../student/StuNotReturn'
import StuReturn from '../../student/StuReturn'


const Content = () => {
  const location = useLocation();
  const pathname = location.pathname;
  
  const isAdmin = pathname.startsWith('/admin-dashboard')
  const isStudent = pathname.startsWith('/student-dashboard')
 
  //kun page active xa tyio check garne
 const isMembersActive = pathname.includes("/members");
  const isDashboardActive = pathname === "/admin-dashboard" || pathname === "/student-dashboard";
  const isBooksActive = pathname.includes("/books");
  const isIssuedActive = pathname.includes("/issued");
  const isReturnedActive = pathname.includes("/returned");
  const isNotReturnedActive = pathname.includes("/not-returned"); 

  // Render components based on active route
  if (isDashboardActive ) {
    return  isStudent ? <StuCard/> : <Cards />;
  }  else if (isMembersActive && isAdmin) {
    return <Members />;
  }
  else if (isIssuedActive) {
    return <Issused />;
  } else if (isBooksActive) {
    return isStudent ? <StuBooks/> : <AdminBooks/>;
  } else if (isReturnedActive) {
    return isStudent ? <StuReturn/>: <AdminReturned/>;
  } else if (isNotReturnedActive) {
    return isStudent? <StuNotReturn/> : <AdminReturned/>;
  }
  return isStudent ? <StuCard /> : <Cards />;
}

export default Content