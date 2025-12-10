import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard"
import Authcontext from './context/authcontext'
import Register from "./pages/Register";

import Members from "./admin/Members";
import Books from "./admin/Books";
import Issued from "./admin/Issused";       
import ReturnedBooks from "./admin/Returned";
import NotReturnedBooks from "./admin/NotReturn";
function App() {
  return (
    <Authcontext>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register/>}></Route>
          <Route path="/admin-dashboard" element={<AdminDashboard />}>
            <Route index element={<div className="text-2xl font-bold">Welcome to Admin Dashboard!</div>} />
              <Route path="members" element={<Members />} />
            <Route path="books" element={<Books />} />
            <Route path="issued" element={<Issued />} />
            <Route path="returned" element={<ReturnedBooks />} />
            <Route path="not-returned" element={<NotReturnedBooks />}/>
          </Route>
          <Route path="/student-dashboard" element={<StudentDashboard />}></Route>
        </Routes>
      </BrowserRouter>
    </Authcontext>
  );
}

export default App