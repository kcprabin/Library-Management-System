import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Login from "./Pages/Login";
import AdminDashboard from "./Pages/AdminDashboard";
import StudentDashboard from "./Pages/StudentDashboard";
import Authcontext from './context/authcontext';
import { ToastProvider } from './context/ToastContext';

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

function App() {
  return (
    <Authcontext>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />}></Route>
            <Route path="/login" element={<Login />}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="new-book" element={<NewBook />} />

            <Route path="/admin-dashboard" element={<AdminDashboard />}>
              <Route index element={<Cards />} />
              <Route path="members" element={<Members />} />
              <Route path="books" element={<Books />} />
              <Route path="issued" element={<Issued />} />
              <Route path="returned" element={<ReturnedBooks />} />
              <Route path="not-returned" element={<NotReturnedBooks />}/>
            </Route>

            <Route path="/student-dashboard" element={<StudentDashboard />}>
              <Route index element={<StuCards />} />
              <Route path="books" element={<StuBooks />} />
              <Route path="returned" element={<ReturnedBooks />} />
              <Route path="issue" element={<Issue />}/>
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </Authcontext>
  );
}

export default App;