import AssignmentPanel from "../components/AssignmentPanel.jsx";
import AttendancePanel from "../components/AttendancePanel.jsx";
import StudentTableSkeleton from "../components/AssignmentSkeleton.jsx";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar.jsx';
import StudentForm from '../components/StudentForm.jsx';
import StudentTable from '../components/StudentTable.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import React from "react";

const Dashboard = () => {
  const { user, API_URL } = useAuth();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [myTimetable, setMyTimetable] = useState([]);
  const [teacherAnnouncements, setTeacherAnnouncements] = useState([]);
  const [announcementFilter, setAnnouncementFilter] = useState("all");

  useEffect(() => {
  const savedTimetable =
    JSON.parse(localStorage.getItem("timetableRecords")) || [];

  const filtered = savedTimetable.filter(
    (item) =>
      item.facultyEmail?.toLowerCase() === user?.email?.toLowerCase()
  );

  setMyTimetable(filtered);
}, [user?.email]);

  const config = {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  };

  useEffect(() => {
  const savedTimetable =
    JSON.parse(localStorage.getItem("timetableRecords")) || [];

  setMyTimetable(savedTimetable);
}, []);

useEffect(() => {
  const savedAnnouncements =
    JSON.parse(localStorage.getItem("announcements")) || [];

  const teacherSideAnnouncements = savedAnnouncements.filter(
    (item) =>
      item.audience === "teachers" || item.audience === "students"
  );

  setTeacherAnnouncements(teacherSideAnnouncements);
}, []);

const filteredAnnouncements = teacherAnnouncements.filter((item) => {
  if (announcementFilter === "all") return true;
  return item.audience === announcementFilter;
});

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/api/students?search=${search}`, config);
      setStudents(data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

 
  const handleSubmit = async (formData) => {
  try {
    if (selectedStudent) {
      const { data } = await axios.put(
        `${API_URL}/api/students/${selectedStudent._id}`,
        formData,
        config
      );

      const updatedStudents = students.map((student) =>
        student._id === data._id ? data : student
      );

      setStudents(updatedStudents);
      localStorage.setItem("adminStudents", JSON.stringify(updatedStudents));

      setSelectedStudent(null);
      toast.success("Student updated");
    } else {
      const { data } = await axios.post(
        `${API_URL}/api/students`,
        formData,
        config
      );

      const updatedStudents = [data, ...students];

      setStudents(updatedStudents);
      localStorage.setItem("adminStudents", JSON.stringify(updatedStudents));

      toast.success("Student added");
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Operation failed");
  }
};
  

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this student?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/api/students/${id}`, config);
      setStudents(students.filter((student) => student._id !== id));
      toast.success('Student deleted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const stats = useMemo(() => {
    const departments = new Set(students.map((student) => student.department));
    const semesters = new Set(students.map((student) => student.semester));
    return {
      total: students.length,
      departments: departments.size,
      semesters: semesters.size,
    };
  }, [students]);

  return (
  <motion.div
    className="min-h-screen bg-slate-50"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-blue-600 text-white rounded-2xl p-6 shadow transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <p className="text-blue-100">Total Students</p>
            <h2 className="text-4xl font-bold mt-2">{stats.total}</h2>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow border border-slate-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <p className="text-slate-500">Departments</p>
            <h2 className="text-4xl font-bold mt-2 text-slate-800">{stats.departments}</h2>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow border border-slate-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <p className="text-slate-500">Active Semesters</p>
            <h2 className="text-4xl font-bold mt-2 text-slate-800">{stats.semesters}</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <StudentForm
              onSubmit={handleSubmit}
              selectedStudent={selectedStudent}
              clearSelected={() => setSelectedStudent(null)}
            />
          </div>

          <div className="xl:col-span-3 space-y-5">
            <div className="bg-white p-4 rounded-2xl shadow border border-slate-200">
              <input
                className="input"
                placeholder="Search by name, roll number, email or department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {loading ? (
  <StudentTableSkeleton />
) : (
  <StudentTable
    students={students}
    onEdit={setSelectedStudent}
    onDelete={handleDelete}
  />
)}
          </div>
        </div>
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 mt-8 mb-8">
  <h2 className="text-2xl font-extrabold text-black mb-2">
  Announcements
</h2>
<p className="text-slate-500 mb-5">
  Notices published by admin for teachers and students.
</p>

<div className="flex flex-wrap gap-3 mb-5">
  <button
    onClick={() => setAnnouncementFilter("all")}
    className={`px-4 py-2 rounded-xl font-semibold transition ${
      announcementFilter === "all"
        ? "bg-blue-600 text-white"
        : "bg-slate-100 text-black"
    }`}
  >
    All
  </button>

  <button
    onClick={() => setAnnouncementFilter("teachers")}
    className={`px-4 py-2 rounded-xl font-semibold transition ${
      announcementFilter === "teachers"
        ? "bg-purple-600 text-white"
        : "bg-slate-100 text-black"
    }`}
  >
    Teacher Announcements
  </button>

  <button
    onClick={() => setAnnouncementFilter("students")}
    className={`px-4 py-2 rounded-xl font-semibold transition ${
      announcementFilter === "students"
        ? "bg-green-600 text-white"
        : "bg-slate-100 text-black"
    }`}
  >
    Student Announcements
  </button>
</div>

<div className="flex gap-3 mb-5">
  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
    All: {teacherAnnouncements.length}
  </span>

  <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-bold text-sm">
    Teachers: {
      teacherAnnouncements.filter(
        (item) => item.audience === "teachers"
      ).length
    }
  </span>

  <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-bold text-sm">
    Students: {
      teacherAnnouncements.filter(
        (item) => item.audience === "students"
      ).length
    }
  </span>
</div>

  {teacherAnnouncements.length === 0 ? (
    <div className="bg-slate-50 rounded-2xl p-6 text-center text-slate-500">
      No announcements available.
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {filteredAnnouncements.map((item) => (
        <div
          key={item.id}
          className="border border-slate-200 rounded-2xl p-5 bg-slate-50"
        >
          <div className="flex justify-between gap-3">
            <div>

              <p
  className={`text-sm font-bold uppercase ${
    item.audience === "teachers"
      ? "text-purple-600"
      : "text-green-600"
  }`}
>
  {item.audience === "teachers"
    ? "Teacher Notice"
    : "Student Notice"}
</p>

<h3 className="font-extrabold text-black text-xl">
  {item.title}
</h3>

            </div>
            <span
              className={`h-fit px-3 py-1 rounded-full text-xs font-bold ${
                item.priority === "Urgent"
                  ? "bg-red-100 text-red-700"
                  : item.priority === "Important"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {item.priority}
            </span>
          </div>

          <p className="text-slate-600 mt-3">
            {item.message}
          </p>

          <p className="text-slate-400 text-sm mt-3">
            Date: {item.date}
          </p>
        </div>
      ))}
    </div>
  )}
</div>
        <AssignmentPanel />
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 mt-8">
  <h2 className="text-2xl font-extrabold text-black mb-2">
    My Assigned Timetable
  </h2>
  <p className="text-slate-500 mb-5">
    Your classes assigned by admin.
  </p>

  {myTimetable.length === 0 ? (
    <div className="bg-slate-50 rounded-2xl p-6 text-center text-slate-500">
      No timetable assigned yet.
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {myTimetable.map((item) => (
        <div
          key={item.id}
          className="border border-slate-200 rounded-2xl p-5 bg-slate-50"
        >
          <div className="flex justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-cyan-600 uppercase">
                {item.day}
              </p>
              <h3 className="font-extrabold text-black text-xl">
                {item.subject}
              </h3>
              <p className="text-slate-500 text-sm">
                {item.departments}
              </p>
            </div>

            <span className="h-fit px-3 py-1 rounded-full bg-cyan-100 text-cyan-700 text-xs font-bold">
              Semester {item.semester}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-3">
              <p className="text-slate-500 text-sm">Class</p>
              <p className="font-bold text-black">{item.className}</p>
            </div>

            <div className="bg-white rounded-xl p-3">
              <p className="text-slate-500 text-sm">Room</p>
              <p className="font-bold text-black">{item.room}</p>
            </div>
          </div>

          <div className="mt-3 bg-blue-50 rounded-xl p-3">
            <p className="text-slate-500 text-sm">Time</p>
            <p className="font-extrabold text-blue-700">
              {item.startTime} - {item.endTime}
            </p>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
        <AttendancePanel students={students} />
      </main>
    </motion.div>
  );
};

export default Dashboard;
