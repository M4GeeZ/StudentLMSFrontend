import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const AssignmentDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const assignment = location.state?.assignment;

  const storageKey = `assignment_demo_${id}`;

  const [teacherFiles, setTeacherFiles] = useState([]);
  const [studentSubmissions, setStudentSubmissions] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [selectedTeacherFile, setSelectedTeacherFile] = useState(null);
  const [selectedStudentFile, setSelectedStudentFile] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(storageKey));

    if (saved) {
      setTeacherFiles(saved.teacherFiles || []);
      setStudentSubmissions(saved.studentSubmissions || []);
    }
  }, [storageKey]);

  const saveToLocalStorage = (newTeacherFiles, newSubmissions) => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        teacherFiles: newTeacherFiles,
        studentSubmissions: newSubmissions,
      }),
    );
  };

  const formatSize = (size) => {
    if (size < 1024) return `${size} Bytes`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getFileType = (file) => {
    if (!file) return "Unknown";
    if (file.type.includes("pdf")) return "PDF";
    if (file.type.includes("image")) return "Image";
    if (file.type.includes("word") || file.name.endsWith(".docx"))
      return "Document";
    return "File";
  };

  const handleTeacherUpload = () => {
    if (!selectedTeacherFile) {
      toast.error("Please select a file first");
      return;
    }

    const newFile = {
      id: Date.now(),
      name: selectedTeacherFile.name,
      size: formatSize(selectedTeacherFile.size),
      type: getFileType(selectedTeacherFile),
      uploadedAt: new Date().toLocaleString(),
      url: URL.createObjectURL(selectedTeacherFile),
    };

    const updatedFiles = [newFile, ...teacherFiles];
    setTeacherFiles(updatedFiles);
    saveToLocalStorage(updatedFiles, studentSubmissions);
    setSelectedTeacherFile(null);
    toast.success("Assignment file uploaded");
  };

  const handleStudentSubmit = () => {
    if (!studentName.trim()) {
      toast.error("Enter student name");
      return;
    }

    if (!selectedStudentFile) {
      toast.error("Please select submission file");
      return;
    }

    const newSubmission = {
      id: Date.now(),
      studentName,
      fileName: selectedStudentFile.name,
      size: formatSize(selectedStudentFile.size),
      type: getFileType(selectedStudentFile),
      submittedAt: new Date().toLocaleString(),
      status: "Submitted",
      url: URL.createObjectURL(selectedStudentFile),
    };

    const updatedSubmissions = [newSubmission, ...studentSubmissions];
    setStudentSubmissions(updatedSubmissions);
    saveToLocalStorage(teacherFiles, updatedSubmissions);
    setStudentName("");
    setSelectedStudentFile(null);
    toast.success("Assignment submitted");
  };

  const handleDeleteTeacherFile = (fileId) => {
    const updated = teacherFiles.filter((file) => file.id !== fileId);
    setTeacherFiles(updated);
    saveToLocalStorage(updated, studentSubmissions);
    toast.success("File removed");
  };

  const handleDeleteSubmission = (submissionId) => {
    const updated = studentSubmissions.filter(
      (item) => item.id !== submissionId,
    );
    setStudentSubmissions(updated);
    saveToLocalStorage(teacherFiles, updated);
    toast.success("Submission removed");
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/dashboard"
          className="inline-block mb-6 px-5 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition"
        >
          ← Back to Dashboard
        </Link>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <p className="text-sm font-bold text-blue-600 uppercase">
                Assignment Details
              </p>
              <h1 className="text-3xl md:text-4xl font-extrabold text-black mt-1">
                {assignment?.title || "Assignment"}
              </h1>
              <p className="text-slate-600 mt-2">
                {assignment?.description ||
                  "Upload and submit assignment files."}
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4">
              <p className="text-sm text-slate-500">Deadline</p>
              <h3 className="text-xl font-bold text-blue-700">
                {assignment?.deadline
                  ? new Date(assignment.deadline).toLocaleDateString()
                  : "Not Set"}
              </h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Teacher Upload */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6">
            <h2 className="text-2xl font-extrabold text-black mb-2">
              Teacher File Upload
            </h2>
            <p className="text-slate-500 mb-5">
              Upload assignment PDF, document, picture or any small demo file.
            </p>

            <div className="border-2 border-dashed border-blue-300 rounded-3xl p-8 bg-blue-50/60 text-center hover:border-blue-500 transition">
              <div className="text-5xl mb-3">📤</div>
              <h3 className="text-xl font-bold text-black">
                Upload Assignment File
              </h3>
              <p className="text-slate-500 text-sm mt-1">
                PDF, DOCX, JPG, PNG, TXT supported for demo
              </p>

              <input
                id="teacherFile"
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                onChange={(e) => setSelectedTeacherFile(e.target.files[0])}
              />

              <label
                htmlFor="teacherFile"
                className="inline-block mt-5 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl cursor-pointer transition"
              >
                Choose File
              </label>

              {selectedTeacherFile && (
                <div className="mt-5 bg-white border border-slate-200 rounded-2xl p-4 text-left">
                  <p className="font-bold text-black">
                    {selectedTeacherFile.name}
                  </p>
                  <p className="text-sm text-slate-500">
                    {getFileType(selectedTeacherFile)} •{" "}
                    {formatSize(selectedTeacherFile.size)}
                  </p>
                </div>
              )}

              <button
                onClick={handleTeacherUpload}
                className="mt-5 w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl transition"
              >
                Upload File
              </button>
            </div>

            <div className="mt-6">
              <h3 className="font-extrabold text-black mb-3">Uploaded Files</h3>

              {teacherFiles.length === 0 ? (
                <p className="text-slate-500 bg-slate-50 rounded-2xl p-5 text-center">
                  No assignment files uploaded yet
                </p>
              ) : (
                <div className="space-y-3">
                  {teacherFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between gap-4 bg-slate-50 border border-slate-200 rounded-2xl p-4"
                    >
                      <div>
                        <h4 className="font-bold text-black">{file.name}</h4>
                        <p className="text-sm text-slate-500">
                          {file.type} • {file.size} • {file.uploadedAt}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <a
                          href={file.url}
                          download={file.name}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm"
                        >
                          Download
                        </a>

                        <button
                          onClick={() => handleDeleteTeacherFile(file.id)}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm"
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

          {/* Student Submission */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6">
            <h2 className="text-2xl font-extrabold text-black mb-2">
              Student Submission
            </h2>
            <p className="text-slate-500 mb-5">
              Students can upload their completed assignment file here.
            </p>

            <div className="grid grid-cols-1 gap-4">
              <input
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="Student Name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
              />

              <div className="border-2 border-dashed border-cyan-300 rounded-3xl p-8 bg-cyan-50/60 text-center">
                <div className="text-5xl mb-3">📝</div>
                <h3 className="text-xl font-bold text-black">
                  Submit Your Work
                </h3>
                <p className="text-slate-500 text-sm mt-1">
                  Upload PDF, picture or document
                </p>

                <input
                  id="studentFile"
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                  onChange={(e) => setSelectedStudentFile(e.target.files[0])}
                />

                <label
                  htmlFor="studentFile"
                  className="inline-block mt-5 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-xl cursor-pointer transition"
                >
                  Choose Submission File
                </label>

                {selectedStudentFile && (
                  <div className="mt-5 bg-white border border-slate-200 rounded-2xl p-4 text-left">
                    <p className="font-bold text-black">
                      {selectedStudentFile.name}
                    </p>
                    <p className="text-sm text-slate-500">
                      {getFileType(selectedStudentFile)} •{" "}
                      {formatSize(selectedStudentFile.size)}
                    </p>
                  </div>
                )}

                <button
                  onClick={handleStudentSubmit}
                  className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
                >
                  Submit Assignment
                </button>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-extrabold text-black mb-3">Submitted Work</h3>

              {studentSubmissions.length === 0 ? (
                <p className="text-slate-500 bg-slate-50 rounded-2xl p-5 text-center">
                  No submissions yet
                </p>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left">
                    <thead className="bg-slate-900 text-white">
                      <tr>
                        <th className="p-4">Student</th>
                        <th className="p-4">File</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {studentSubmissions.map((item) => (
                        <tr key={item.id} className="border-t border-slate-200">
                          <td className="p-4 font-bold text-black">
                            {item.studentName}
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <a
                                href={item.url}
                                download={item.fileName}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm"
                              >
                                Download
                              </a>

                              <button
                                onClick={() => handleDeleteSubmission(item.id)}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm"
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

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-2xl p-5 text-yellow-800">
          <b>Demo Note:</b> Files are stored locally for presentation demo. In
          production, Cloudinary, Firebase Storage or AWS S3 can be integrated
          for real file uploads.
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetails;
