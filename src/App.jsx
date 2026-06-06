import React from "react";
import StudentPortal from './pages/StudentPortal.jsx';
import AssignmentDetails from "./pages/AssignmentDetails.jsx";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { useAuth } from './context/AuthContext.jsx';
import AdminDashboard from "./pages/AdminDashboard.jsx";
import FacultyManagement from "./pages/FacultyManagement.jsx";
import AdminStudentManagement from "./pages/AdminStudentManagement.jsx";
import SalaryModule from "./pages/SalaryModule.jsx";
import TimetableModule from "./pages/TimetableModule.jsx";
import AdminAttendanceOverview from "./pages/AdminAttendanceOverview.jsx";
import AnnouncementsModule from "./pages/AnnouncementsModule.jsx";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/admin/announcements" element={<AnnouncementsModule />} />
      <Route path="/admin/attendance" element={<AdminAttendanceOverview />} />
      <Route path="/admin/timetable" element={<TimetableModule />} />
      <Route path="/admin/faculty" element={<FacultyManagement />} />
      <Route path="/admin/students" element={<AdminStudentManagement />} />
      <Route path="/admin/salary" element={<SalaryModule />} />
      
      <Route
  path="/student-portal"
  element={
    <ProtectedRoute>
      <StudentPortal />
    </ProtectedRoute>
  }
/>

<Route
  path="/"
  element={
    user ? (
      localStorage.getItem("userRole") === "student" ? (
        <Navigate to="/student-portal" />
      ) : (
        <Navigate to="/dashboard" />
      )
    ) : (
      <Navigate to="/login" />
    )
  }
/>

      <Route
  path="/"
  element={
    user ? (
      localStorage.getItem("userRole") === "student" ? (
        <Navigate to="/student-portal" />
      ) : (
        <Navigate to="/dashboard" />
      )
    ) : (
      <Navigate to="/login" />
    )
  }
/>
      <Route
  path="/assignments/:id"
  element={
    <ProtectedRoute>
      <AssignmentDetails />
    </ProtectedRoute>
  }
/>
    </Routes>
  );
};

export default App;
