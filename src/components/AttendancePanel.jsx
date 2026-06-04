import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";

const AttendancePanel = ({ students }) => {
  const { user, API_URL } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [formData, setFormData] = useState({
    student: "",
    status: "Present",
    date: new Date().toISOString().split("T")[0],
  });

  const config = {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  };

  const fetchAttendance = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/attendance`, config);
      setAttendance(data);
    } catch {
      toast.error("Failed to fetch attendance");
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.student) {
      toast.error("Please select a student");
      return;
    }

    try {
      await axios.post(`${API_URL}/api/attendance`, formData, config);
      toast.success("Attendance marked");
      fetchAttendance();
    } catch {
      toast.error("Attendance failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this attendance record?")) return;

    try {
      await axios.delete(`${API_URL}/api/attendance/${id}`, config);
      setAttendance(attendance.filter((item) => item._id !== id));
      toast.success("Attendance deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const stats = useMemo(() => {
    const total = attendance.length;
    const present = attendance.filter((item) => item.status === "Present").length;
    const absent = attendance.filter((item) => item.status === "Absent").length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    return { total, present, absent, percentage };
  }, [attendance]);

  return (
    <div className="mt-8 bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-black">Attendance Module</h2>
          <p className="text-slate-500 text-sm">Mark student attendance and track percentage.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-slate-100 rounded-xl px-4 py-3">
            <p className="text-xs text-slate-500">Total</p>
            <h3 className="text-xl font-bold text-black">{stats.total}</h3>
          </div>
          <div className="bg-green-100 rounded-xl px-4 py-3">
            <p className="text-xs text-green-700">Present</p>
            <h3 className="text-xl font-bold text-green-700">{stats.present}</h3>
          </div>
          <div className="bg-red-100 rounded-xl px-4 py-3">
            <p className="text-xs text-red-700">Absent</p>
            <h3 className="text-xl font-bold text-red-700">{stats.absent}</h3>
          </div>
          <div className="bg-blue-100 rounded-xl px-4 py-3">
            <p className="text-xs text-blue-700">Percentage</p>
            <h3 className="text-xl font-bold text-blue-700">{stats.percentage}%</h3>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <select
          className="input !text-black"
          value={formData.student}
          onChange={(e) => setFormData({ ...formData, student: e.target.value })}
          required
        >
          <option value="">Select Student</option>
          {students.map((student) => (
            <option key={student._id} value={student._id}>
              {student.name} - {student.rollNumber}
            </option>
          ))}
        </select>

        <select
          className="input !text-black"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>

        <input
          className="input !text-black"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />

        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition">
          Mark Attendance
        </button>
      </form>

      <div className="overflow-x-auto max-h-[350px] overflow-y-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left">
          <thead className="bg-slate-900 text-white sticky top-0">
            <tr>
              <th className="p-4">Student</th>
              <th className="p-4">Roll No</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {attendance.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-6 text-center text-slate-500 font-semibold">
                  No attendance records found
                </td>
              </tr>
            ) : (
              attendance.map((item) => (
                <tr key={item._id} className="border-t border-slate-200 hover:bg-blue-50">
                  <td className="p-4 font-bold text-black">{item.student?.name || "Deleted Student"}</td>
                  <td className="p-4 font-semibold text-slate-800">{item.student?.rollNumber || "-"}</td>
                  <td className="p-4 font-semibold text-slate-800">{item.date}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.status === "Present"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendancePanel;