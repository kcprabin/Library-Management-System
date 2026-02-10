import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./Pages/Login";
import AdminDashboard from "./Pages/AdminDashboard";
import StudentDashboard from "./Pages/StudentDashboard";
import ProfileSettings from "./Pages/ProfileSettings";
import AccountSettings from "./Pages/AccountSettings";
import HelpSupport from "./Pages/HelpSupport";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import Authcontext from './context/authcontext';
import ProtectedRoute from './componets/common/ProtectedRoute';

import Cards from "./admin/Cards";
import Members from "./admin/Members";
import Books from "./admin/AdminBooks";
import NewBook from "./admin/NewBook";
import Issued from "./admin/Issused";       
import ReturnedBooks from "./admin/AdminReturned";
import NotReturnedBooks from "./admin/AdminNotReturn";
import Register from "./Pages/Register";

import StuCards from "./student/StuCards";
import StuBooks from "./student/StuBooks";
import Issue from "./student/Issue";
import StuReturn from "./student/StuReturn";

function App() {
  return (
    <Authcontext>
      <Toaster position="top-right" />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />}></Route>
            <Route path="/login" element={<Login />}/>
            <Route path="/forgot-password" element={<ForgotPassword />}/>
            <Route path="/reset-password" element={<ResetPassword />}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/new-book" element={<ProtectedRoute requiredRole="admin"><NewBook /></ProtectedRoute>} />

            {/* Profile Routes */}
            <Route path="/profile-settings" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
            <Route path="/account-settings" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
            <Route path="/help-support" element={<ProtectedRoute><HelpSupport /></ProtectedRoute>} />

            {/* Admin Dashboard Routes */}
            <Route path="/admin-dashboard" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>}>
              <Route index element={<Cards />} />
              <Route path="members" element={<ProtectedRoute requiredRole="admin"><Members /></ProtectedRoute>} />
              <Route path="books" element={<ProtectedRoute requiredRole="admin"><Books /></ProtectedRoute>} />
              <Route path="issued" element={<ProtectedRoute requiredRole="admin"><Issued /></ProtectedRoute>} />
              <Route path="returned" element={<ProtectedRoute requiredRole="admin"><ReturnedBooks /></ProtectedRoute>} />
              <Route path="not-returned" element={<ProtectedRoute requiredRole="admin"><NotReturnedBooks /></ProtectedRoute>}/>
            </Route>

            {/* Student Dashboard Routes */}
            <Route path="/student-dashboard" element={<ProtectedRoute requiredRole="student"><StudentDashboard /></ProtectedRoute>}>
              <Route index element={<StuCards />} />
              <Route path="books" element={<ProtectedRoute requiredRole="student"><StuBooks /></ProtectedRoute>} />
              <Route path="returned" element={<ProtectedRoute requiredRole="student"><StuReturn /></ProtectedRoute>} />
              <Route path="issue" element={<ProtectedRoute requiredRole="student"><Issue /></ProtectedRoute>}/>
            </Route>
          </Routes>
        </BrowserRouter>
    </Authcontext>
  );
}

export default App;