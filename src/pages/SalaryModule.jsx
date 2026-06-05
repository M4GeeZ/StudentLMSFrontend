import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const initialSalaryState = {
  facultyId: "",
  month: "",
  basicSalary: "",
  bonus: "",
  deduction: "",
  status: "Unpaid",
  paymentDate: "",
  remarks: "",
};

const SalaryModule = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [salaryRecords, setSalaryRecords] = useState([]);
  const [formData, setFormData] = useState(initialSalaryState);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const savedFaculty = JSON.parse(localStorage.getItem("facultyList")) || [];
    const savedSalary = JSON.parse(localStorage.getItem("salaryRecords")) || [];

    setFacultyList(savedFaculty);
    setSalaryRecords(savedSalary);
  }, []);

  const saveSalaryRecords = (records) => {
    setSalaryRecords(records);
    localStorage.setItem("salaryRecords", JSON.stringify(records));
  };

  const selectedFaculty = facultyList.find(
    (faculty) => String(faculty.id) === String(formData.facultyId)
  );

  const totalPayable =
    Number(formData.basicSalary || 0) +
    Number(formData.bonus || 0) -
    Number(formData.deduction || 0);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["basicSalary", "bonus", "deduction"].includes(name)) {
      const onlyDigits = value.replace(/\D/g, "");
      setFormData({ ...formData, [name]: onlyDigits });
      return;
    }

    if (name === "facultyId") {
      const faculty = facultyList.find((item) => String(item.id) === String(value));

      setFormData({
        ...formData,
        facultyId: value,
        basicSalary: faculty?.salary || "",
      });

      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedFaculty) {
      toast.error("Please select faculty member");
      return;
    }

    const salaryData = {
      id: editId || Date.now(),
      facultyId: formData.facultyId,
      facultyName: selectedFaculty.name,
      facultyEmail: selectedFaculty.email,
      subject: selectedFaculty.subject,
      assignedClass: selectedFaculty.assignedClass,
      month: formData.month,
      basicSalary: formData.basicSalary,
      bonus: formData.bonus || "0",
      deduction: formData.deduction || "0",
      totalPayable,
      status: formData.status,
      paymentDate: formData.paymentDate,
      remarks: formData.remarks,
      createdAt: new Date().toLocaleString(),
    };

    if (editId) {
      const updated = salaryRecords.map((record) =>
        record.id === editId ? salaryData : record
      );

      saveSalaryRecords(updated);
      setEditId(null);
      toast.success("Salary record updated");
    } else {
      saveSalaryRecords([salaryData, ...salaryRecords]);
      toast.success("Salary record added");
    }

    setFormData(initialSalaryState);
  };

  const handleEdit = (record) => {
    setEditId(record.id);
    setFormData({
      facultyId: record.facultyId,
      month: record.month,
      basicSalary: record.basicSalary,
      bonus: record.bonus,
      deduction: record.deduction,
      status: record.status,
      paymentDate: record.paymentDate,
      remarks: record.remarks,
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this salary record?")) return;

    const updated = salaryRecords.filter((record) => record.id !== id);
    saveSalaryRecords(updated);
    toast.success("Salary record deleted");
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setFormData(initialSalaryState);
  };

  const filteredRecords = useMemo(() => {
    return salaryRecords.filter((record) => {
      const text = `${record.facultyName} ${record.facultyEmail} ${record.subject} ${record.month}`.toLowerCase();

      const matchesSearch = text.includes(search.toLowerCase());
      const matchesStatus = statusFilter ? record.status === statusFilter : true;

      return matchesSearch && matchesStatus;
    });
  }, [salaryRecords, search, statusFilter]);

  const totalPaid = salaryRecords
    .filter((record) => record.status === "Paid")
    .reduce((sum, record) => sum + Number(record.totalPayable || 0), 0);

  const totalUnpaid = salaryRecords
    .filter((record) => record.status === "Unpaid")
    .reduce((sum, record) => sum + Number(record.totalPayable || 0), 0);

  const paidCount = salaryRecords.filter((record) => record.status === "Paid").length;
  const unpaidCount = salaryRecords.filter((record) => record.status === "Unpaid").length;

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
          <h1 className="text-4xl font-extrabold text-black">Salary Module</h1>
          <p className="text-slate-500 mt-2">
            Manage faculty salaries, paid/unpaid status, bonuses and deductions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-2xl shadow p-6 border">
            <p className="text-slate-500">Salary Records</p>
            <h2 className="text-4xl font-bold text-blue-600 mt-2">
              {salaryRecords.length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 border">
            <p className="text-slate-500">Paid Records</p>
            <h2 className="text-4xl font-bold text-green-600 mt-2">
              {paidCount}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 border">
            <p className="text-slate-500">Unpaid Records</p>
            <h2 className="text-4xl font-bold text-red-600 mt-2">
              {unpaidCount}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 border">
            <p className="text-slate-500">Total Paid</p>
            <h2 className="text-3xl font-bold text-purple-600 mt-2">
              Rs. {totalPaid}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6">
              <h2 className="text-2xl font-extrabold text-black mb-5">
                {editId ? "Update Salary" : "Add Salary"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <select
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  name="facultyId"
                  value={formData.facultyId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Faculty</option>
                  {facultyList.map((faculty) => (
                    <option key={faculty.id} value={faculty.id}>
                      {faculty.name} - {faculty.subject}
                    </option>
                  ))}
                </select>

                <select
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Month</option>
                  {[
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                  ].map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>

                <input
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  name="basicSalary"
                  placeholder="Basic Salary"
                  value={formData.basicSalary}
                  onChange={handleChange}
                  required
                />

                <input
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  name="bonus"
                  placeholder="Bonus Optional"
                  value={formData.bonus}
                  onChange={handleChange}
                />

                <input
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  name="deduction"
                  placeholder="Deduction Optional"
                  value={formData.deduction}
                  onChange={handleChange}
                />

                <select
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="Unpaid">Unpaid</option>
                  <option value="Paid">Paid</option>
                </select>

                <input
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  name="paymentDate"
                  type="date"
                  value={formData.paymentDate}
                  onChange={handleChange}
                />

                <input
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  name="remarks"
                  placeholder="Remarks Optional"
                  value={formData.remarks}
                  onChange={handleChange}
                />

                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                  <p className="text-slate-500 text-sm">Total Payable</p>
                  <h3 className="text-2xl font-extrabold text-blue-700">
                    Rs. {totalPayable || 0}
                  </h3>
                </div>

                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition">
                  {editId ? "Update Salary" : "Add Salary"}
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
                placeholder="Search by faculty name, email, subject or month..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-200">
              <select
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>

            {salaryRecords.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center text-slate-500">
                No salary records added yet.
              </div>
            ) : filteredRecords.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center text-slate-500">
                No salary records found.
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-900 text-white">
                      <tr>
                        <th className="p-4">Faculty</th>
                        <th className="p-4">Month</th>
                        <th className="p-4">Salary</th>
                        <th className="p-4">Bonus</th>
                        <th className="p-4">Deduction</th>
                        <th className="p-4">Payable</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredRecords.map((record) => (
                        <tr
                          key={record.id}
                          className="border-t border-slate-200 hover:bg-purple-50 transition"
                        >
                          <td className="p-4">
                            <p className="font-bold text-black">{record.facultyName}</p>
                            <p className="text-sm text-blue-600">{record.facultyEmail}</p>
                            <p className="text-sm text-slate-500">{record.subject}</p>
                          </td>

                          <td className="p-4 font-semibold text-slate-800">
                            {record.month}
                          </td>

                          <td className="p-4 font-semibold text-slate-800">
                            Rs. {record.basicSalary}
                          </td>

                          <td className="p-4 font-semibold text-green-600">
                            Rs. {record.bonus}
                          </td>

                          <td className="p-4 font-semibold text-red-600">
                            Rs. {record.deduction}
                          </td>

                          <td className="p-4 font-bold text-purple-700">
                            Rs. {record.totalPayable}
                          </td>

                          <td className="p-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                record.status === "Paid"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {record.status}
                            </span>
                          </td>

                          <td className="p-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(record)}
                                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-semibold"
                              >
                                Edit
                              </button>

                              <button
                                onClick={() => handleDelete(record.id)}
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

            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
              <h3 className="text-xl font-extrabold text-black mb-3">
                Salary Summary
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
                  <p className="text-slate-500">Total Paid Amount</p>
                  <h4 className="text-2xl font-bold text-green-700">
                    Rs. {totalPaid}
                  </h4>
                </div>

                <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
                  <p className="text-slate-500">Total Unpaid Amount</p>
                  <h4 className="text-2xl font-bold text-red-700">
                    Rs. {totalUnpaid}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        {facultyList.length === 0 && (
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-2xl p-5 text-yellow-800">
            <b>Note:</b> Add faculty members first from Faculty Management module, then create salary records here.
          </div>
        )}
      </div>
    </div>
  );
};

export default SalaryModule;