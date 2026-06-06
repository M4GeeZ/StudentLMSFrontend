import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const AdminAttendanceOverview = () => {
  const [students, setStudents] = useState([]);
  const [facultyList, setFacultyList] = useState([]);

  const [studentAttendance, setStudentAttendance] = useState([]);
  const [teacherAttendance, setTeacherAttendance] = useState([]);

  const [studentForm, setStudentForm] = useState({
    studentId: "",
    date: new Date().toISOString().split("T")[0],
    status: "Present",
  });

  const [teacherForm, setTeacherForm] = useState({
    teacherId: "",
    date: new Date().toISOString().split("T")[0],
    status: "Present",
  });

  const [activeTab, setActiveTab] = useState("students");

  useEffect(() => {
    const savedStudents = JSON.parse(localStorage.getItem("adminStudents")) || [];
    const savedFaculty = JSON.parse(localStorage.getItem("facultyList")) || [];
    const savedStudentAttendance =
      JSON.parse(localStorage.getItem("adminStudentAttendance")) || [];
    const savedTeacherAttendance =
      JSON.parse(localStorage.getItem("adminTeacherAttendance")) || [];

    setStudents(savedStudents);
    setFacultyList(savedFaculty);
    setStudentAttendance(savedStudentAttendance);
    setTeacherAttendance(savedTeacherAttendance);
  }, []);

  const saveStudentAttendance = (records) => {
    setStudentAttendance(records);
    localStorage.setItem("adminStudentAttendance", JSON.stringify(records));
  };

  const saveTeacherAttendance = (records) => {
    setTeacherAttendance(records);
    localStorage.setItem("adminTeacherAttendance", JSON.stringify(records));
  };

  const selectedStudent = students.find(
    (student) => String(student._id) === String(studentForm.studentId)
  );

  const selectedTeacher = facultyList.find(
    (teacher) => String(teacher.id) === String(teacherForm.teacherId)
  );

  const handleStudentSubmit = (e) => {
    e.preventDefault();

    if (!selectedStudent) {
      toast.error("Please select student");
      return;
    }

    const newRecord = {
      id: Date.now(),
      studentId: selectedStudent._id,
      name: selectedStudent.name,
      rollNumber: selectedStudent.rollNumber,
      department: selectedStudent.department,
      semester: selectedStudent.semester,
      date: studentForm.date,
      status: studentForm.status,
    };

    const updated = [newRecord, ...studentAttendance];
    saveStudentAttendance(updated);

    setStudentForm({
      studentId: "",
      date: new Date().toISOString().split("T")[0],
      status: "Present",
    });

    toast.success("Student attendance marked");
  };

  const handleTeacherSubmit = (e) => {
    e.preventDefault();

    if (!selectedTeacher) {
      toast.error("Please select teacher");
      return;
    }

    const newRecord = {
      id: Date.now(),
      teacherId: selectedTeacher.id,
      name: selectedTeacher.name,
      email: selectedTeacher.email,
      subject: selectedTeacher.subject,
      assignedClass: selectedTeacher.assignedClass,
      date: teacherForm.date,
      status: teacherForm.status,
    };

    const updated = [newRecord, ...teacherAttendance];
    saveTeacherAttendance(updated);

    setTeacherForm({
      teacherId: "",
      date: new Date().toISOString().split("T")[0],
      status: "Present",
    });

    toast.success("Teacher attendance marked");
  };

  const deleteStudentAttendance = (id) => {
    if (!window.confirm("Delete this student attendance record?")) return;

    const updated = studentAttendance.filter((item) => item.id !== id);
    saveStudentAttendance(updated);
    toast.success("Student attendance deleted");
  };

  const deleteTeacherAttendance = (id) => {
    if (!window.confirm("Delete this teacher attendance record?")) return;

    const updated = teacherAttendance.filter((item) => item.id !== id);
    saveTeacherAttendance(updated);
    toast.success("Teacher attendance deleted");
  };

  const studentStats = useMemo(() => {
    const total = studentAttendance.length;
    const present = studentAttendance.filter((item) => item.status === "Present").length;
    const absent = studentAttendance.filter((item) => item.status === "Absent").length;
    const percentage = total ? Math.round((present / total) * 100) : 0;

    return { total, present, absent, percentage };
  }, [studentAttendance]);

  const teacherStats = useMemo(() => {
    const total = teacherAttendance.length;
    const present = teacherAttendance.filter((item) => item.status === "Present").length;
    const absent = teacherAttendance.filter((item) => item.status === "Absent").length;
    const percentage = total ? Math.round((present / total) * 100) : 0;

    return { total, present, absent, percentage };
  }, [teacherAttendance]);

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/admin-dashboard"
          className="inline-block mb-6 px-5 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition"
        >
          ← Back to Admin Dashboard
        </Link>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 mb-8">
          <h1 className="text-4xl font-extrabold text-black">
            Attendance Overview
          </h1>
          <p className="text-slate-500 mt-2">
            Admin can mark and monitor student and teacher attendance records.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-2xl shadow p-6 border">
            <p className="text-slate-500">Student Records</p>
            <h2 className="text-4xl font-bold text-blue-600 mt-2">
              {studentStats.total}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 border">
            <p className="text-slate-500">Student Present</p>
            <h2 className="text-4xl font-bold text-green-600 mt-2">
              {studentStats.present}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 border">
            <p className="text-slate-500">Teacher Records</p>
            <h2 className="text-4xl font-bold text-purple-600 mt-2">
              {teacherStats.total}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 border">
            <p className="text-slate-500">Teacher Present</p>
            <h2 className="text-4xl font-bold text-orange-500 mt-2">
              {teacherStats.present}
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-4 mb-8">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setActiveTab("students")}
              className={`py-3 rounded-xl font-bold transition ${
                activeTab === "students"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-black"
              }`}
            >
              Student Attendance
            </button>

            <button
              onClick={() => setActiveTab("teachers")}
              className={`py-3 rounded-xl font-bold transition ${
                activeTab === "teachers"
                  ? "bg-purple-600 text-white"
                  : "bg-slate-100 text-black"
              }`}
            >
              Teacher Attendance
            </button>
          </div>
        </div>

        {activeTab === "students" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6">
                <h2 className="text-2xl font-extrabold text-black mb-5">
                  Mark Student
                </h2>

                <form onSubmit={handleStudentSubmit} className="space-y-4">
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    value={studentForm.studentId}
                    onChange={(e) =>
                      setStudentForm({ ...studentForm, studentId: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Student</option>
                    {students.map((student) => (
                      <option key={student._id} value={student._id}>
                        {student.name} - {student.rollNumber}
                      </option>
                    ))}
                  </select>

                  <input
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    type="date"
                    value={studentForm.date}
                    onChange={(e) =>
                      setStudentForm({ ...studentForm, date: e.target.value })
                    }
                    required
                  />

                  <select
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    value={studentForm.status}
                    onChange={(e) =>
                      setStudentForm({ ...studentForm, status: e.target.value })
                    }
                    required
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                  </select>

                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition">
                    Mark Student Attendance
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-900 text-white">
                    <tr>
                      <th className="p-4">Student</th>
                      <th className="p-4">Roll No</th>
                      <th className="p-4">Department</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {studentAttendance.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-slate-500">
                          No student attendance records yet.
                        </td>
                      </tr>
                    ) : (
                      studentAttendance.map((item) => (
                        <tr
                          key={item.id}
                          className="border-t border-slate-200 hover:bg-blue-50 transition"
                        >
                          <td className="p-4">
                            <p className="font-bold text-black">{item.name}</p>
                            <p className="text-sm text-slate-500">
                              Semester {item.semester}
                            </p>
                          </td>

                          <td className="p-4 font-semibold text-slate-800">
                            {item.rollNumber}
                          </td>

                          <td className="p-4">
                            <span className="px-3 py-1 rounded-full bg-cyan-100 text-cyan-700 text-xs font-bold">
                              {item.department}
                            </span>
                          </td>

                          <td className="p-4 font-semibold text-slate-800">
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

                          <td className="p-4">
                            <button
                              onClick={() => deleteStudentAttendance(item.id)}
                              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold"
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
          </div>
        )}

        {activeTab === "teachers" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6">
                <h2 className="text-2xl font-extrabold text-black mb-5">
                  Mark Teacher
                </h2>

                <form onSubmit={handleTeacherSubmit} className="space-y-4">
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-black outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    value={teacherForm.teacherId}
                    onChange={(e) =>
                      setTeacherForm({ ...teacherForm, teacherId: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Teacher</option>
                    {facultyList.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name} - {teacher.subject}
                      </option>
                    ))}
                  </select>

                  <input
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-black outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    type="date"
                    value={teacherForm.date}
                    onChange={(e) =>
                      setTeacherForm({ ...teacherForm, date: e.target.value })
                    }
                    required
                  />

                  <select
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-black outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    value={teacherForm.status}
                    onChange={(e) =>
                      setTeacherForm({ ...teacherForm, status: e.target.value })
                    }
                    required
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                  </select>

                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition">
                    Mark Teacher Attendance
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-900 text-white">
                    <tr>
                      <th className="p-4">Teacher</th>
                      <th className="p-4">Subject</th>
                      <th className="p-4">Class</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {teacherAttendance.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-slate-500">
                          No teacher attendance records yet.
                        </td>
                      </tr>
                    ) : (
                      teacherAttendance.map((item) => (
                        <tr
                          key={item.id}
                          className="border-t border-slate-200 hover:bg-purple-50 transition"
                        >
                          <td className="p-4">
                            <p className="font-bold text-black">{item.name}</p>
                            <p className="text-sm text-blue-600">{item.email}</p>
                          </td>

                          <td className="p-4 font-semibold text-slate-800">
                            {item.subject}
                          </td>

                          <td className="p-4">
                            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
                              {item.assignedClass}
                            </span>
                          </td>

                          <td className="p-4 font-semibold text-slate-800">
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

                          <td className="p-4">
                            <button
                              onClick={() => deleteTeacherAttendance(item.id)}
                              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold"
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
          </div>
        )}

        {(students.length === 0 || facultyList.length === 0) && (
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-2xl p-5 text-yellow-800">
            <b>Note:</b> Add students from Student Management and faculty members
            from Faculty Management first, then mark attendance here.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAttendanceOverview;