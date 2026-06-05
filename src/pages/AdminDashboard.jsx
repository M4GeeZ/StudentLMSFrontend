import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("adminUser");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <nav className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Admin Portal</h1>
          <p className="text-slate-300 text-sm">Principal / Owner Dashboard</p>
        </div>

        <button
          onClick={handleLogout}
          className="px-5 py-2 bg-red-500 hover:bg-red-600 rounded-xl font-semibold"
        >
          Logout
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-4xl font-extrabold text-black">
            Welcome, Admin
          </h2>
          <p className="text-slate-500 mt-2">
            Manage faculty, students, attendance, salary, timetable and LMS activities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-2xl shadow p-6 border">
            <p className="text-slate-500">Total Students</p>
            <h3 className="text-4xl font-bold text-blue-600 mt-2">120</h3>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 border">
            <p className="text-slate-500">Faculty Members</p>
            <h3 className="text-4xl font-bold text-green-600 mt-2">18</h3>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 border">
            <p className="text-slate-500">Pending Salaries</p>
            <h3 className="text-4xl font-bold text-red-600 mt-2">5</h3>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 border">
            <p className="text-slate-500">Today Classes</p>
            <h3 className="text-4xl font-bold text-purple-600 mt-2">9</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl shadow-xl border p-6">
            <h3 className="text-2xl font-extrabold text-black mb-4">
              Faculty Management
            </h3>
            <p className="text-slate-500 mb-4">
              Add teachers, assign subjects, manage salary and schedules.
            </p>

            <Link
  to="/admin/faculty"
  className="block text-center w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
>
  Manage Faculty
</Link>

          </div>

          <div className="bg-white rounded-3xl shadow-xl border p-6">
            <h3 className="text-2xl font-extrabold text-black mb-4">
              Student Management
            </h3>
            <p className="text-slate-500 mb-4">
              View student records, attendance, grades and submissions.
            </p>
            <Link
  to="/admin/students"
  className="block text-center w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold"
>
  View Students
</Link>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border p-6">
            <h3 className="text-2xl font-extrabold text-black mb-4">
              Salary Module
            </h3>
            <p className="text-slate-500 mb-4">
              Track paid, unpaid salaries, bonuses and deductions.
            </p>
            <Link
  to="/admin/salary"
  className="block text-center w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold"
>
  Manage Salaries
</Link>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border p-6">
            <h3 className="text-2xl font-extrabold text-black mb-4">
              Timetable
            </h3>
            <p className="text-slate-500 mb-4">
              Manage teacher classes, rooms, subjects and timing.
            </p>
            <Link
  to="/admin/timetable"
  className="block text-center w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-xl font-semibold"
>
  View Timetable
</Link>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border p-6">
            <h3 className="text-2xl font-extrabold text-black mb-4">
              Attendance Overview
            </h3>
            <p className="text-slate-500 mb-4">
              Monitor student and faculty attendance records.
            </p>
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold">
              View Attendance
            </button>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border p-6">
            <h3 className="text-2xl font-extrabold text-black mb-4">
              Announcements
            </h3>
            <p className="text-slate-500 mb-4">
              Publish notices for faculty members and students.
            </p>
            <button className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-semibold">
              Create Notice
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;