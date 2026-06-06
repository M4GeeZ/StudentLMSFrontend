import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const initialAnnouncementState = {
  title: "",
  message: "",
  audience: "teachers",
  priority: "Normal",
  date: new Date().toISOString().split("T")[0],
};

const AnnouncementsModule = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [formData, setFormData] = useState(initialAnnouncementState);
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const savedAnnouncements =
      JSON.parse(localStorage.getItem("announcements")) || [];

    setAnnouncements(savedAnnouncements);
  }, []);

  const saveAnnouncements = (records) => {
    setAnnouncements(records);
    localStorage.setItem("announcements", JSON.stringify(records));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const announcementData = {
      id: editId || Date.now(),
      ...formData,
      createdAt: editId ? undefined : new Date().toLocaleString(),
      updatedAt: editId ? new Date().toLocaleString() : "",
    };

    if (editId) {
      const updated = announcements.map((item) =>
        item.id === editId
          ? {
              ...item,
              ...announcementData,
              createdAt: item.createdAt,
            }
          : item
      );

      saveAnnouncements(updated);
      setEditId(null);
      toast.success("Announcement updated");
    } else {
      saveAnnouncements([announcementData, ...announcements]);
      toast.success("Announcement created");
    }

    setFormData(initialAnnouncementState);
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setFormData({
      title: item.title || "",
      message: item.message || "",
      audience: item.audience || "teachers",
      priority: item.priority || "Normal",
      date: item.date || new Date().toISOString().split("T")[0],
    });
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setFormData(initialAnnouncementState);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this announcement?")) return;

    const updated = announcements.filter((item) => item.id !== id);
    saveAnnouncements(updated);
    toast.success("Announcement deleted");
  };

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((item) => {
      const text = `${item.title} ${item.message} ${item.audience} ${item.priority}`.toLowerCase();

      const matchesSearch = text.includes(search.toLowerCase());
      const matchesFilter = filter === "all" ? true : item.audience === filter;

      return matchesSearch && matchesFilter;
    });
  }, [announcements, search, filter]);

  const teacherCount = announcements.filter(
    (item) => item.audience === "teachers"
  ).length;

  const studentCount = announcements.filter(
    (item) => item.audience === "students"
  ).length;

  const urgentCount = announcements.filter(
    (item) => item.priority === "Urgent"
  ).length;

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
            Announcements
          </h1>
          <p className="text-slate-500 mt-2">
            Create separate announcements for teachers and students.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-2xl shadow p-6 border">
            <p className="text-slate-500">Total Announcements</p>
            <h2 className="text-4xl font-bold text-blue-600 mt-2">
              {announcements.length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 border">
            <p className="text-slate-500">For Teachers</p>
            <h2 className="text-4xl font-bold text-purple-600 mt-2">
              {teacherCount}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 border">
            <p className="text-slate-500">For Students</p>
            <h2 className="text-4xl font-bold text-green-600 mt-2">
              {studentCount}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 border">
            <p className="text-slate-500">Urgent Notices</p>
            <h2 className="text-4xl font-bold text-red-600 mt-2">
              {urgentCount}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6">
              <h2 className="text-2xl font-extrabold text-black mb-5">
                {editId ? "Update Notice" : "Create Notice"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  name="title"
                  placeholder="Announcement Title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />

                <textarea
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 min-h-[130px]"
                  name="message"
                  placeholder="Write announcement message..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                />

                <select
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  name="audience"
                  value={formData.audience}
                  onChange={handleChange}
                  required
                >
                  <option value="teachers">Teachers</option>
                  <option value="students">Students</option>
                </select>

                <select
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  required
                >
                  <option value="Normal">Normal</option>
                  <option value="Important">Important</option>
                  <option value="Urgent">Urgent</option>
                </select>

                <input
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />

                <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl transition">
                  {editId ? "Update Announcement" : "Create Announcement"}
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
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-4">
              <input
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="Search announcements..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-4">
              <select
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Announcements</option>
                <option value="teachers">Teachers Only</option>
                <option value="students">Students Only</option>
              </select>
            </div>

            {filteredAnnouncements.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center text-slate-500">
                No announcements found.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredAnnouncements.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 hover:-translate-y-1 transition"
                  >
                    <div className="flex justify-between gap-4">
                      <div>
                        <p
                          className={`text-sm font-bold uppercase ${
                            item.audience === "teachers"
                              ? "text-purple-600"
                              : "text-green-600"
                          }`}
                        >
                          {item.audience === "teachers"
                            ? "For Teachers"
                            : "For Students"}
                        </p>

                        <h3 className="text-2xl font-extrabold text-black mt-1">
                          {item.title}
                        </h3>
                      </div>

                      <span
                        className={`h-fit px-3 py-1 rounded-full text-xs font-bold ${
                          item.priority === "Urgent"
                            ? "bg-red-100 text-red-700"
                            : item.priority === "Important"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {item.priority}
                      </span>
                    </div>

                    <p className="text-slate-600 mt-4 leading-relaxed">
                      {item.message}
                    </p>

                    <div className="mt-5 bg-slate-50 rounded-2xl p-4">
                      <p className="text-slate-500 text-sm">Date</p>
                      <p className="font-bold text-black">{item.date}</p>
                    </div>

                    <div className="flex gap-2 mt-5">
                      <button
                        onClick={() => handleEdit(item)}
                        className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-semibold"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
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
  );
};

export default AnnouncementsModule;