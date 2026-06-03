import React, { useEffect, useState } from "react";

const initialState = {
  name: "",
  email: "",
  rollNumber: "",
  department: "",
  semester: "",
  phone: "",
  address: "",
};

const StudentForm = ({ onSubmit, selectedStudent, clearSelected }) => {
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (selectedStudent) {
      setFormData({
        name: selectedStudent.name || "",
        email: selectedStudent.email || "",
        rollNumber: selectedStudent.rollNumber || "",
        department: selectedStudent.department || "",
        semester: selectedStudent.semester || "",
        phone: selectedStudent.phone || "",
        address: selectedStudent.address || "",
      });
    }
  }, [selectedStudent]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData(initialState);
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-extrabold text-white">
          {selectedStudent ? "Update Student" : "Add Student"}
        </h2>

        {selectedStudent && (
          <button
            onClick={() => {
              clearSelected();
              setFormData(initialState);
            }}
            className="text-sm text-cyan-400 hover:underline"
          >
            Cancel
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <input className="input !text-black" name="name" placeholder="Student Name" value={formData.name} onChange={handleChange} required />
        <input className="input !text-black" name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input className="input !text-black" name="rollNumber" placeholder="Roll Number" value={formData.rollNumber} onChange={handleChange} required />
        <input className="input !text-black" name="department" placeholder="Department e.g. BSCS" value={formData.department} onChange={handleChange} required />
        <input className="input !text-black" name="semester" type="number" min="1" max="8" placeholder="Semester" value={formData.semester} onChange={handleChange} required />
        <input
  className="input !text-black"
  name="phone"
  placeholder="Phone Number"
  value={formData.phone}
  onChange={(e) => {
    const onlyDigits = e.target.value.replace(/\D/g, "");
    setFormData({ ...formData, phone: onlyDigits });
  }}
  maxLength="11"
  inputMode="numeric"
  required
/>
        <input className="input !text-black" name="address" placeholder="Address Optional" value={formData.address} onChange={handleChange} />

        <button className="btn-primary">
          {selectedStudent ? "Update Student" : "Add Student"}
        </button>
      </form>
    </div>
  );
};

export default StudentForm;