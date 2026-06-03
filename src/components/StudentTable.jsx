import React from "react";

const StudentTable = ({ students, onEdit, onDelete }) => {
  return (
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
            {students.length === 0 ? (
              <tr>
                <td className="p-8 text-center text-slate-600 font-semibold" colSpan="6">
                  No students found
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr
                  key={student._id}
                  className="border-t border-slate-200 hover:bg-blue-50 transition"
                >
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{student.name}</div>
                    <div className="text-sm font-medium text-blue-600">{student.email}</div>
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
                        onClick={() => onEdit(student)}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold transition"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => onDelete(student._id)}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition"
                      >
                        Delete
                      </button>
                    </div>
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

export default StudentTable;