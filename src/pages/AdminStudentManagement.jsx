import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const initialStudentState = {
  name: "",
  email: "",
  rollNumber: "",
  department: "",
  semester: "",
  phone: "",
  address: "",
};

const AdminStudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialStudentState);
  const [editId, setEditId] = useState(null);

  const fetchStudents = () => {
    setLoading(true);
    try {
      const savedStudents = JSON.parse(localStorage.getItem("adminStudents")) || [];
      setStudents(savedStudents);
    } catch {
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const departments = [
    ...new Set(students.map((s) => s.department).filter(Boolean)),
  ];

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const text = `${student.name} ${student.email} ${student.rollNumber} ${student.department}`.toLowerCase();

      const matchesSearch = text.includes(search.toLowerCase());
      const matchesDepartment = departmentFilter
        ? student.department === departmentFilter
        : true;
      const matchesSemester = semesterFilter
        ? String(student.semester) === String(semesterFilter)
        : true;

      return matchesSearch && matchesDepartment && matchesSemester;
    });
  }, [students, search, departmentFilter, semesterFilter]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const saveStudents = (updatedStudents) => {
    setStudents(updatedStudents);
    localStorage.setItem("adminStudents", JSON.stringify(updatedStudents));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      const updatedStudents = students.map((student) =>
        student._id === editId ? { ...formData, _id: editId } : student
      );

      saveStudents(updatedStudents);
      setEditId(null);
      setFormData(initialStudentState);
      toast.success("Student updated successfully");
    } else {
      const newStudent = {
        _id: Date.now().toString(),
        ...formData,
      };

      const updatedStudents = [newStudent, ...students];
      saveStudents(updatedStudents);
      setFormData(initialStudentState);
      toast.success("Student added successfully");
    }
  };

  const handleEdit = (student) => {
    setEditId(student._id);
    setFormData({
      name: student.name || "",
      email: student.email || "",
      rollNumber: student.rollNumber || "",
      department: student.department || "",
      semester: student.semester || "",
      phone: student.phone || "",
      address: student.address || "",
    });
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setFormData(initialStudentState);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    const updatedStudents = students.filter((student) => student._id !== id);
    saveStudents(updatedStudents);
    toast.success("Student deleted");
  };

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
            Student Management
          </h1>
          <p className="text-slate-500 mt-2">
            Admin can add, update, search, filter and delete student records.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-2xl shadow p-6 border">
            <p className="text-slate-500">Total Students</p>
            <h2 className="text-4xl font-bold text-blue-600 mt-2">
              {students.length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 border">
            <p className="text-slate-500">Filtered Results</p>
            <h2 className="text-4xl font-bold text-green-600 mt-2">
              {filteredStudents.length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 border">
            <p className="text-slate-500">Departments</p>
            <h2 className="text-4xl font-bold text-purple-600 mt-2">
              {departments.length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 border">
            <p className="text-slate-500">Semesters</p>
            <h2 className="text-4xl font-bold text-orange-500 mt-2">
              {[...new Set(students.map((s) => s.semester))].length}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6">
              <h2 className="text-2xl font-extrabold text-black mb-5">
                {editId ? "Update Student" : "Add Student"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  name="name"
                  placeholder="Student Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

                <input
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <input
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  name="rollNumber"
                  placeholder="Roll Number"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  required
                />

                <input
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  name="department"
                  placeholder="Department e.g. BSCS"
                  value={formData.department}
                  onChange={handleChange}
                  required
                />

                <select
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Semester</option>
                  {[...Array(10)].map((_, index) => (
                    <option key={index + 1} value={index + 1}>
                      Semester {index + 1}
                    </option>
                  ))}
                </select>

                <input
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => {
                    const onlyDigits = e.target.value.replace(/\D/g, "");
                    setFormData({ ...formData, phone: onlyDigits });
                  }}
                  maxLength="11"
                  required
                />

                <input
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  name="address"
                  placeholder="Address Optional"
                  value={formData.address}
                  onChange={handleChange}
                />

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition">
                  {editId ? "Update Student" : "Add Student"}
                </button>

                {editId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="w-full bg-slate-700 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl transition"
                  >
                    Cancel Edit
                  </button>
                )}
              </form>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-5">
            <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-200">
              <input
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="Search by name, roll number, email or department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                >
                  <option value="">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>

                <select
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={semesterFilter}
                  onChange={(e) => setSemesterFilter(e.target.value)}
                >
                  <option value="">All Semesters</option>
                  {[...Array(10)].map((_, index) => (
                    <option key={index + 1} value={index + 1}>
                      Semester {index + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center text-slate-500">
                Loading students...
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center text-slate-500">
                No students found.
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-900 text-white">
                      <tr>
                        <th className="p-4">Name</th>
                        <th className="p-4">Roll No</th>
                        <th className="p-4">Department</th>
                        <th className="p-4">Semester</th>
                        <th className="p-4">Phone</th>
                        <th className="p-4">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredStudents.map((student) => (
                        <tr
                          key={student._id}
                          className="border-t border-slate-200 hover:bg-blue-50 transition"
                        >
                          <td className="p-4">
                            <p className="font-bold text-black">{student.name}</p>
                            <p className="text-sm text-blue-600">{student.email}</p>
                          </td>

                          <td className="p-4 font-semibold text-slate-800">
                            {student.rollNumber}
                          </td>

                          <td className="p-4">
                            <span className="px-3 py-1 rounded-full bg-cyan-100 text-cyan-700 text-xs font-bold">
                              {student.department}
                            </span>
                          </td>

                          <td className="p-4 font-semibold text-slate-800">
                            {student.semester}
                          </td>

                          <td className="p-4 font-semibold text-slate-800">
                            {student.phone}
                          </td>

                          <td className="p-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(student)}
                                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-semibold"
                              >
                                Edit
                              </button>

                              <button
                                onClick={() => handleDelete(student._id)}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStudentManagement;