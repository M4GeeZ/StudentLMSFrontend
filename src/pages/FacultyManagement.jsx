import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const initialState = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  assignedClass: "",
  semester: "",
  salary: "",
};

const FacultyManagement = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [formData, setFormData] = useState(initialState);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const savedFaculty = JSON.parse(localStorage.getItem("facultyList")) || [];
    setFacultyList(savedFaculty);
  }, []);

  const saveFaculty = (updatedList) => {
    setFacultyList(updatedList);
    localStorage.setItem("facultyList", JSON.stringify(updatedList));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      const updatedList = facultyList.map((faculty) =>
        faculty.id === editId ? { ...formData, id: editId } : faculty
      );

      saveFaculty(updatedList);
      setEditId(null);
      toast.success("Faculty updated successfully");
    } else {
      const newFaculty = {
        id: Date.now(),
        ...formData,
      };

      saveFaculty([newFaculty, ...facultyList]);
      toast.success("Faculty added successfully");
    }

    setFormData(initialState);
  };

  const handleEdit = (faculty) => {
    setEditId(faculty.id);
    setFormData({
  name: faculty.name,
  email: faculty.email,
  phone: faculty.phone,
  subject: faculty.subject,
  assignedClass: faculty.assignedClass,
  semester: faculty.semester || "",
  salary: faculty.salary,
});
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this faculty member?")) {
      return;
    }

    const updatedList = facultyList.filter((faculty) => faculty.id !== id);
    saveFaculty(updatedList);
    toast.success("Faculty deleted successfully");
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setFormData(initialState);
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
            Faculty Management
          </h1>
          <p className="text-slate-500 mt-2">
            Add, update, delete and manage faculty records, subjects, classes and salary details.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6">
            <h2 className="text-2xl font-extrabold text-black mb-5">
              {editId ? "Update Faculty" : "Add Faculty"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                name="name"
                placeholder="Faculty Name"
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
                name="subject"
                placeholder="Subject e.g. Web Development"
                value={formData.subject}
                onChange={handleChange}
                required
              />

              <input
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                name="assignedClass"
                placeholder="Assigned Class e.g. BSCS 2nd Semester"
                value={formData.assignedClass}
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
                name="salary"
                placeholder="Salary e.g. 50000"
                value={formData.salary}
                onChange={(e) => {
                  const onlyDigits = e.target.value.replace(/\D/g, "");
                  setFormData({ ...formData, salary: onlyDigits });
                }}
                required
              />

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition">
                {editId ? "Update Faculty" : "Add Faculty"}
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

          <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-2xl font-extrabold text-black">
                  Faculty Records
                </h2>
                <p className="text-slate-500 text-sm">
                  Total Faculty: {facultyList.length}
                </p>
              </div>
            </div>

            {facultyList.length === 0 ? (
              <div className="bg-slate-50 rounded-2xl p-8 text-center text-slate-500">
                No faculty members added yet.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left">
                  <thead className="bg-slate-900 text-white">
                    <tr>
                      <th className="p-4">Name</th>
                      <th className="p-4">Subject</th>
                      <th className="p-4">Class</th>
                      <th className="p-4">Salary</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {facultyList.map((faculty) => (
                      <tr
                        key={faculty.id}
                        className="border-t border-slate-200 hover:bg-blue-50 transition"
                      >
                        <td className="p-4">
                          <p className="font-bold text-black">{faculty.name}</p>
                          <p className="text-sm text-blue-600">{faculty.email}</p>
                          <p className="text-sm text-slate-500">{faculty.phone}</p>
                        </td>

                        <td className="p-4 font-semibold text-slate-800">
                          {faculty.subject}
                        </td>

                        <td className="p-4">
                          <span className="px-3 py-1 rounded-full bg-cyan-100 text-cyan-700 text-xs font-bold">
                            {faculty.assignedClass}
                          </span>
                        </td>

                        <td className="p-4 font-bold text-green-600">
                          Rs. {faculty.salary}
                        </td>

                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(faculty)}
                              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-semibold"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => handleDelete(faculty.id)}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyManagement;