import AssignmentPanel from "../components/AssignmentPanel.jsx";
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

  const config = {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  };

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
        const { data } = await axios.put(`${API_URL}/api/students/${selectedStudent._id}`, formData, config);
        setStudents(students.map((student) => (student._id === data._id ? data : student)));
        setSelectedStudent(null);
        toast.success('Student updated');
      } else {
        const { data } = await axios.post(`${API_URL}/api/students`, formData, config);
        setStudents([data, ...students]);
        toast.success('Student added');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
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
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-blue-600 text-white rounded-2xl p-6 shadow">
            <p className="text-blue-100">Total Students</p>
            <h2 className="text-4xl font-bold mt-2">{stats.total}</h2>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow border border-slate-200">
            <p className="text-slate-500">Departments</p>
            <h2 className="text-4xl font-bold mt-2 text-slate-800">{stats.departments}</h2>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow border border-slate-200">
            <p className="text-slate-500">Active Semesters</p>
            <h2 className="text-4xl font-bold mt-2 text-slate-800">{stats.semesters}</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <StudentForm
              onSubmit={handleSubmit}
              selectedStudent={selectedStudent}
              clearSelected={() => setSelectedStudent(null)}
            />
          </div>

          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white p-4 rounded-2xl shadow border border-slate-200">
              <input
                className="input"
                placeholder="Search by name, roll number, email or department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {loading ? (
              <div className="bg-white rounded-2xl shadow p-8 text-center text-slate-500">Loading students...</div>
            ) : (
              <StudentTable students={students} onEdit={setSelectedStudent} onDelete={handleDelete} />
            )}
          </div>
        </div>
        <AssignmentPanel />
      </main>
    </div>
  );
};

export default Dashboard;
