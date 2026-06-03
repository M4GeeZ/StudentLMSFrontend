import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";

const AssignmentPanel = () => {
  const { user, API_URL } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    description: "",
    deadline: "",
    attachmentLink: "",
  });

  const config = {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  };

  const fetchAssignments = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/assignments`, config);
      setAssignments(data);
    } catch {
      toast.error("Failed to fetch assignments");
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getDeadlineStatus = (deadline) => {
    const today = new Date();
    const end = new Date(deadline);
    const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));

    if (diff < 0) return { text: "Expired", color: "bg-red-500/20 text-red-300" };
    if (diff <= 2) return { text: `${diff} days left`, color: "bg-yellow-500/20 text-yellow-300" };
    return { text: `${diff} days left`, color: "bg-green-500/20 text-green-300" };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(`${API_URL}/api/assignments`, formData, config);
      setAssignments([data, ...assignments]);
      setFormData({
        title: "",
        subject: "",
        description: "",
        deadline: "",
        attachmentLink: "",
      });
      toast.success("Assignment added");
    } catch {
      toast.error("Assignment add failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this assignment?")) return;

    try {
      await axios.delete(`${API_URL}/api/assignments/${id}`, config);
      setAssignments(assignments.filter((item) => item._id !== id));
      toast.success("Assignment deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
      <div className="bg-white rounded-2xl shadow p-6 border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-5">Add Assignment</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="input !text-black" name="title" placeholder="Assignment Title" value={formData.title} onChange={handleChange} required />
          <input className="input !text-black" name="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} required />
          <textarea className="input min-h-28 !text-black" name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
          <input className="input !text-black" type="date" name="deadline" value={formData.deadline} onChange={handleChange} required />
          <input className="input !text-black" name="attachmentLink" placeholder="Attachment Link Optional" value={formData.attachmentLink} onChange={handleChange} />

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition">
            Add Assignment
          </button>
        </form>
      </div>

      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl shadow border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-5">Assignments for Students</h2>

          {assignments.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No assignments added yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assignments.map((item) => {
                const status = getDeadlineStatus(item.deadline);

                return (
                  <div key={item._id} className="border border-slate-200 rounded-2xl p-5 bg-slate-50 hover:shadow-lg transition">
                    <div className="flex justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-slate-800 text-lg">{item.title}</h3>
                        <p className="text-blue-600 font-semibold text-sm">{item.subject}</p>
                      </div>

                      <span className={`h-fit px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                        {status.text}
                      </span>
                    </div>

                    <p className="text-slate-600 mt-3 text-sm">{item.description}</p>

                    <p className="text-sm text-slate-500 mt-4">
                      Deadline: {new Date(item.deadline).toLocaleDateString()}
                    </p>

                    <div className="flex gap-2 mt-4">
                      {item.attachmentLink && (
                        <a href={item.attachmentLink} target="_blank" className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm">
                          View File
                        </a>
                      )}

                      <button onClick={() => handleDelete(item._id)} className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm">
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentPanel;