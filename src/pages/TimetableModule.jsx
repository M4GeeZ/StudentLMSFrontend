import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const initialTimetableState = {
  facultyId: "",
  subject: "",
  departments: "",
  className: "",
  semester: "",
  day: "",
  startTime: "",
  endTime: "",
  room: "",
};

const initialStudentTimetableState = {
  department: "",
  semester: "",
  subject: "",
  teacherName: "",
  day: "",
  startTime: "",
  endTime: "",
  room: "",
};

const TimetableModule = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [timetableRecords, setTimetableRecords] = useState([]);
  const [formData, setFormData] = useState(initialTimetableState);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [studentEditId, setStudentEditId] = useState(null);
  const [studentTimetableRecords, setStudentTimetableRecords] = useState([]);
  const [studentFormData, setStudentFormData] = useState(
    initialStudentTimetableState
  );

  useEffect(() => {
    const savedFaculty = JSON.parse(localStorage.getItem("facultyList")) || [];
    const savedTimetable =
      JSON.parse(localStorage.getItem("timetableRecords")) || [];
    const savedStudentTimetable =
      JSON.parse(localStorage.getItem("studentTimetableRecords")) || [];

    setFacultyList(savedFaculty);
    setTimetableRecords(savedTimetable);
    setStudentTimetableRecords(savedStudentTimetable);
  }, []);

  const saveTimetable = (records) => {
    setTimetableRecords(records);
    localStorage.setItem("timetableRecords", JSON.stringify(records));
  };

  const selectedFaculty = facultyList.find(
    (faculty) => String(faculty.id) === String(formData.facultyId)
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "facultyId") {
      const faculty = facultyList.find(
        (item) => String(item.id) === String(value)
      );

      setFormData({
        ...formData,
        facultyId: value,
        subject: faculty?.subject || "",
        className: faculty?.assignedClass || "",
      });

      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedFaculty) {
      toast.error("Please select faculty member");
      return;
    }

    if (formData.startTime >= formData.endTime) {
      toast.error("End time must be greater than start time");
      return;
    }

    const timetableData = {
      id: editId || Date.now(),
      facultyId: formData.facultyId,
      facultyName: selectedFaculty.name,
      facultyEmail: selectedFaculty.email,
      mainSubject: selectedFaculty.subject,
      subject: formData.subject,
      departments: formData.departments,
      className: formData.className,
      semester: formData.semester,
      day: formData.day,
      startTime: formData.startTime,
      endTime: formData.endTime,
      room: formData.room,
      createdAt: new Date().toLocaleString(),
    };

    if (editId) {
      const updated = timetableRecords.map((record) =>
        record.id === editId ? timetableData : record
      );

      saveTimetable(updated);
      setEditId(null);
      toast.success("Teacher timetable updated successfully");
    } else {
      saveTimetable([timetableData, ...timetableRecords]);
      toast.success("Teacher timetable added successfully");
    }

    setFormData(initialTimetableState);
  };

  const handleEdit = (record) => {
    setEditId(record.id);
    setFormData({
      facultyId: record.facultyId,
      subject: record.subject,
      departments: record.departments,
      className: record.className,
      semester: record.semester,
      day: record.day,
      startTime: record.startTime,
      endTime: record.endTime,
      room: record.room,
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this timetable?"))
      return;

    const updated = timetableRecords.filter((record) => record.id !== id);
    saveTimetable(updated);
    toast.success("Teacher timetable deleted");
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setFormData(initialTimetableState);
  };

  const handleStudentTimetableChange = (e) => {
    setStudentFormData({
      ...studentFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleStudentTimetableSubmit = (e) => {
  e.preventDefault();

  if (studentFormData.startTime >= studentFormData.endTime) {
    toast.error("End time must be greater than start time");
    return;
  }

  if (studentEditId) {
    const updatedRecords = studentTimetableRecords.map((record) =>
      record.id === studentEditId
        ? {
            ...studentFormData,
            id: studentEditId,
            updatedAt: new Date().toLocaleString(),
          }
        : record
    );

    setStudentTimetableRecords(updatedRecords);
    localStorage.setItem(
      "studentTimetableRecords",
      JSON.stringify(updatedRecords)
    );

    setStudentEditId(null);
    setStudentFormData(initialStudentTimetableState);
    toast.success("Student timetable updated");
  } else {
    const newRecord = {
      id: Date.now(),
      ...studentFormData,
      createdAt: new Date().toLocaleString(),
    };

    const updatedRecords = [newRecord, ...studentTimetableRecords];

    setStudentTimetableRecords(updatedRecords);
    localStorage.setItem(
      "studentTimetableRecords",
      JSON.stringify(updatedRecords)
    );

    setStudentFormData(initialStudentTimetableState);
    toast.success("Student timetable added");
  }
};

const handleEditStudentTimetable = (record) => {
  setStudentEditId(record.id);

  setStudentFormData({
    department: record.department || "",
    semester: record.semester || "",
    subject: record.subject || "",
    teacherName: record.teacherName || "",
    day: record.day || "",
    startTime: record.startTime || "",
    endTime: record.endTime || "",
    room: record.room || "",
  });
};

const handleCancelStudentEdit = () => {
  setStudentEditId(null);
  setStudentFormData(initialStudentTimetableState);
};

  const handleDeleteStudentTimetable = (id) => {
    if (!window.confirm("Delete this student timetable?")) return;

    const updatedRecords = studentTimetableRecords.filter(
      (record) => record.id !== id
    );

    setStudentTimetableRecords(updatedRecords);
    localStorage.setItem(
      "studentTimetableRecords",
      JSON.stringify(updatedRecords)
    );

    toast.success("Student timetable deleted");
  };

  const filteredRecords = useMemo(() => {
    return timetableRecords.filter((record) => {
      const text = `${record.facultyName} ${record.subject} ${record.departments} ${record.className} ${record.day} ${record.room}`.toLowerCase();
      return text.includes(search.toLowerCase());
    });
  }, [timetableRecords, search]);

  const totalTeachers = new Set(
    timetableRecords.map((item) => item.facultyId)
  ).size;

  const totalClasses = timetableRecords.length;

  const totalDepartments = new Set(
    timetableRecords
      .flatMap((item) => item.departments.split(",").map((d) => d.trim()))
      .filter(Boolean)
  ).size;
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
            Timetable Module
          </h1>
          <p className="text-slate-500 mt-2">
            Assign teacher and student schedules, subjects, departments, classes,
            time slots and rooms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-2xl shadow p-6 border">
            <p className="text-slate-500">Teacher Classes</p>
            <h2 className="text-4xl font-bold text-blue-600 mt-2">
              {totalClasses}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 border">
            <p className="text-slate-500">Scheduled Teachers</p>
            <h2 className="text-4xl font-bold text-green-600 mt-2">
              {totalTeachers}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 border">
            <p className="text-slate-500">Departments</p>
            <h2 className="text-4xl font-bold text-purple-600 mt-2">
              {totalDepartments}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 border">
            <p className="text-slate-500">Student Classes</p>
            <h2 className="text-4xl font-bold text-orange-500 mt-2">
              {studentTimetableRecords.length}
            </h2>
          </div>
        </div>

        {/* TEACHER TIMETABLE */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 mb-10">
          <h2 className="text-3xl font-extrabold text-black mb-2">
            Teacher Timetable
          </h2>
          <p className="text-slate-500 mb-6">
            Create teacher timetable with subject, departments, class, semester,
            day, time and room.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <form onSubmit={handleSubmit} className="space-y-4">
                <select
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  name="facultyId"
                  value={formData.facultyId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Teacher</option>
                  {facultyList.map((faculty) => (
                    <option key={faculty.id} value={faculty.id}>
                      {faculty.name} - {faculty.subject}
                    </option>
                  ))}
                </select>

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
                  name="departments"
                  placeholder="Departments e.g. BSCS, BSAI"
                  value={formData.departments}
                  onChange={handleChange}
                  required
                />

                <input
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  name="className"
                  placeholder="Class e.g. BSCS Section A"
                  value={formData.className}
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

                <select
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  name="day"
                  value={formData.day}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Day</option>
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    name="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                  />

                  <input
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    name="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                  />
                </div>

                <input
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  name="room"
                  placeholder="Room e.g. Lab 3"
                  value={formData.room}
                  onChange={handleChange}
                  required
                />

                <button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 rounded-xl transition">
                  {editId ? "Update Timetable" : "Add Timetable"}
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

            <div className="lg:col-span-3 space-y-5">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <input
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="Search by teacher, subject, department, class, day or room..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {timetableRecords.length === 0 ? (
                <div className="bg-slate-50 rounded-2xl p-8 text-center text-slate-500">
                  No teacher timetable records added yet.
                </div>
              ) : filteredRecords.length === 0 ? (
                <div className="bg-slate-50 rounded-2xl p-8 text-center text-slate-500">
                  No teacher timetable records found.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filteredRecords.map((record) => (
                    <div
                      key={record.id}
                      className="bg-slate-50 rounded-3xl border border-slate-200 p-6 hover:shadow-lg transition"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-bold text-cyan-600 uppercase">
                            {record.day}
                          </p>
                          <h3 className="text-2xl font-extrabold text-black">
                            {record.facultyName}
                          </h3>
                          <p className="text-sm text-slate-500">
                            Main Subject: {record.mainSubject}
                          </p>
                        </div>

                        <span className="px-3 py-1 rounded-full bg-cyan-100 text-cyan-700 text-xs font-bold">
                          Semester {record.semester}
                        </span>
                      </div>

                      <div className="mt-5 grid grid-cols-1 gap-3">
                        <div className="bg-white rounded-2xl p-4">
                          <p className="text-slate-500 text-sm">
                            Assigned Subject
                          </p>
                          <h4 className="font-bold text-black">
                            {record.subject}
                          </h4>
                        </div>

                        <div className="bg-white rounded-2xl p-4">
                          <p className="text-slate-500 text-sm">Departments</p>
                          <h4 className="font-bold text-black">
                            {record.departments}
                          </h4>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white rounded-2xl p-4">
                            <p className="text-slate-500 text-sm">Class</p>
                            <h4 className="font-bold text-black">
                              {record.className}
                            </h4>
                          </div>

                          <div className="bg-white rounded-2xl p-4">
                            <p className="text-slate-500 text-sm">Room</p>
                            <h4 className="font-bold text-black">
                              {record.room}
                            </h4>
                          </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                          <p className="text-slate-500 text-sm">Time Slot</p>
                          <h4 className="font-extrabold text-blue-700">
                            {record.startTime} - {record.endTime}
                          </h4>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-5">
                        <button
                          onClick={() => handleEdit(record)}
                          className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-semibold"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(record.id)}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {facultyList.length === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 text-yellow-800">
                  <b>Note:</b> Add faculty members first from Faculty Management module.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* STUDENT TIMETABLE */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6">
          <h2 className="text-3xl font-extrabold text-black mb-2">
            Student Timetable
          </h2>
          <p className="text-slate-500 mb-6">
            Create timetable for students by department, semester, subject,
            teacher, day and time.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <form onSubmit={handleStudentTimetableSubmit} className="space-y-4">
                <input
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  name="department"
                  placeholder="Department e.g. BSCS"
                  value={studentFormData.department}
                  onChange={handleStudentTimetableChange}
                  required
                />

                <select
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  name="semester"
                  value={studentFormData.semester}
                  onChange={handleStudentTimetableChange}
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
                  name="subject"
                  placeholder="Subject e.g. Programming"
                  value={studentFormData.subject}
                  onChange={handleStudentTimetableChange}
                  required
                />

                <input
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  name="teacherName"
                  placeholder="Teacher Name"
                  value={studentFormData.teacherName}
                  onChange={handleStudentTimetableChange}
                  required
                />

                <select
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  name="day"
                  value={studentFormData.day}
                  onChange={handleStudentTimetableChange}
                  required
                >
                  <option value="">Select Day</option>
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    name="startTime"
                    type="time"
                    value={studentFormData.startTime}
                    onChange={handleStudentTimetableChange}
                    required
                  />

                  <input
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    name="endTime"
                    type="time"
                    value={studentFormData.endTime}
                    onChange={handleStudentTimetableChange}
                    required
                  />
                </div>

                <input
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  name="room"
                  placeholder="Room e.g. Lab 1"
                  value={studentFormData.room}
                  onChange={handleStudentTimetableChange}
                  required
                />

               <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition">
  {studentEditId ? "Update Student Timetable" : "Add Student Timetable"}
</button>

{studentEditId && (
  <button
    type="button"
    onClick={handleCancelStudentEdit}
    className="w-full bg-slate-700 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl transition"
  >
    Cancel Edit
  </button>
)}
              </form>
            </div>

            <div className="lg:col-span-3">
              {studentTimetableRecords.length === 0 ? (
                <div className="bg-slate-50 rounded-2xl p-8 text-center text-slate-500">
                  No student timetable added yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {studentTimetableRecords.map((record) => (
                    <div
                      key={record.id}
                      className="bg-slate-50 rounded-3xl border border-slate-200 p-6 hover:shadow-lg transition"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-bold text-blue-600 uppercase">
                            {record.day}
                          </p>
                          <h3 className="text-2xl font-extrabold text-black">
                            {record.subject}
                          </h3>
                          <p className="text-slate-500 text-sm">
                            Teacher: {record.teacherName}
                          </p>
                        </div>

                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                          Semester {record.semester}
                        </span>
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <div className="bg-white rounded-2xl p-4">
                          <p className="text-slate-500 text-sm">Department</p>
                          <h4 className="font-bold text-black">
                            {record.department}
                          </h4>
                        </div>

                        <div className="bg-white rounded-2xl p-4">
                          <p className="text-slate-500 text-sm">Room</p>
                          <h4 className="font-bold text-black">{record.room}</h4>
                        </div>
                      </div>

                      <div className="mt-3 bg-blue-50 border border-blue-100 rounded-2xl p-4">
                        <p className="text-slate-500 text-sm">Time Slot</p>
                        <h4 className="font-extrabold text-blue-700">
                          {record.startTime} - {record.endTime}
                        </h4>
                      </div>

                      <div className="flex gap-2 mt-5">
  <button
    onClick={() => handleEditStudentTimetable(record)}
    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-semibold"
  >
    Edit
  </button>

  <button
    onClick={() => handleDeleteStudentTimetable(record.id)}
    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold"
  >
    Delete
  </button>
</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    );
    };

export default TimetableModule;