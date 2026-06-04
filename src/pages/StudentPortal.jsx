import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const StudentPortal = () => {
  const { user, API_URL, logout } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  const config = {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  };

  const fetchStudentData = async () => {
    try {
      setLoading(true);

      const [assignmentRes, attendanceRes] = await Promise.all([
        axios.get(`${API_URL}/api/assignments`, config),
        axios.get(`${API_URL}/api/attendance`, config),
      ]);

      setAssignments(assignmentRes.data);

      const myAttendance = attendanceRes.data.filter((item) => {
        const studentName = item.student?.name?.toLowerCase();
        const studentEmail = item.student?.email?.toLowerCase();

        return (
          studentName === user?.name?.toLowerCase() ||
          studentEmail === user?.email?.toLowerCase()
        );
      });

      setAttendance(myAttendance);
    } catch (error) {
      toast.error("Failed to fetch student data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) fetchStudentData();
  }, [user?.token]);

  const present = attendance.filter((item) => item.status === "Present").length;
  const absent = attendance.filter((item) => item.status === "Absent").length;
  const total = attendance.length;
  const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-100">
      <nav className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-black">
              Student Portal
            </h1>
            <p className="text-slate-500 text-sm">
              Welcome, {user?.name}
            </p>
          </div>

          <button
            onClick={logout}
            className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow">
            Loading student portal...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
              <div className="bg-blue-600 text-white rounded-2xl p-6 shadow">
                <p className="text-blue-100">Assignments</p>
                <h2 className="text-4xl font-bold mt-2">{assignments.length}</h2>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow border">
                <p className="text-slate-500">Present</p>
                <h2 className="text-4xl font-bold mt-2 text-green-600">{present}</h2>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow border">
                <p className="text-slate-500">Absent</p>
                <h2 className="text-4xl font-bold mt-2 text-red-600">{absent}</h2>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow border">
                <p className="text-slate-500">Attendance</p>
                <h2 className="text-4xl font-bold mt-2 text-blue-700">{percentage}%</h2>
              </div>
            </div>

            <section className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 mb-8">
              <h2 className="text-2xl font-extrabold text-black mb-5">
                My Assignments
              </h2>

              {assignments.length === 0 ? (
                <p className="text-slate-500">No assignments available</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {assignments.map((item) => (
                    <div
                      key={item._id}
                      className="border border-slate-200 rounded-2xl p-5 bg-slate-50 hover:shadow-lg transition"
                    >
                      <h3 className="text-xl font-bold text-black">{item.title}</h3>
                      <p className="text-blue-600 font-semibold text-sm">
                        {item.subject}
                      </p>

                      <p className="text-slate-600 mt-3 text-sm">
                        {item.description}
                      </p>

                      <p className="text-sm text-slate-500 mt-4">
                        Deadline: {new Date(item.deadline).toLocaleDateString()}
                      </p>

                      <Link
                        to={`/assignments/${item._id}`}
                        state={{ assignment: item, mode: "student" }}
                        className="inline-block mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm"
                      >
                        Open / Submit
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6">
              <h2 className="text-2xl font-extrabold text-black mb-5">
                My Attendance
              </h2>

              {attendance.length === 0 ? (
                <p className="text-slate-500">No attendance records found</p>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left">
                    <thead className="bg-slate-900 text-white">
                      <tr>
                        <th className="p-4">Date</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {attendance.map((item) => (
                        <tr key={item._id} className="border-t border-slate-200">
                          <td className="p-4 text-black font-semibold">
                            {item.date}
                          </td>
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default StudentPortal;