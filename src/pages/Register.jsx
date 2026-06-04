import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const handleSubmit = async (e) => {
    e.preventDefault();

if (password !== confirmPassword) {
  toast.error("Passwords do not match");
  return;
}

if (password !== confirmPassword) {
  toast.error("Passwords do not match");
  return;
}
setLoading(true);
    try {
      await register(name, email, password);

localStorage.setItem("userRole", role);

toast.success('Account created');

if (role === "student") {
  navigate("/student-portal");
} else {
  navigate("/dashboard");
}
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top_right,#2563eb,transparent_30%),linear-gradient(135deg,#020617,#0f172a,#111827)] px-4">
      <div className="card w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-3xl">
            🚀
          </div>
          <h1 className="text-4xl font-extrabold text-white">Create Account</h1>
          <p className="text-slate-400 mt-2">Start managing your students</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3 mb-4">
  <button
    type="button"
    onClick={() => setRole("faculty")}
    className={`py-3 rounded-xl font-semibold border transition ${
      role === "faculty"
        ? "bg-blue-600 text-white border-blue-600"
        : "bg-white text-black border-slate-300"
    }`}
  >
    Faculty
  </button>

  <button
    type="button"
    onClick={() => setRole("student")}
    className={`py-3 rounded-xl font-semibold border transition ${
      role === "student"
        ? "bg-blue-600 text-white border-blue-600"
        : "bg-white text-black border-slate-300"
    }`}
  >
    Student
  </button>
</div>
          <input className="input" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input className="input" type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
<div className="relative">
  <input
    className="input pr-12"
    type={showPassword ? "text" : "password"}
    placeholder="Password min 6 characters"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
    minLength="6"
  />

 <button
  type="button"
  onClick={() => setShowPassword(!showPassword)}
  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-600 transition"
>
  {showPassword ? (
    <i className="fa-regular fa-eye"></i>
  ) : (
    <i className="fa-regular fa-eye-slash"></i>
  )}
</button>
</div>

<div className="relative">
  <input
    className="input pr-12"
    type={showConfirmPassword ? "text" : "password"}
    placeholder="Confirm Password"
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    required
    minLength="6"
  />
  <button
  type="button"
  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-600 transition"
>
  {showConfirmPassword ? (
    <i className="fa-regular fa-eye"></i>
  ) : (
    <i className="fa-regular fa-eye-slash"></i>
  )}
</button>
</div>
          <button disabled={loading} className="btn-primary w-full">
            {loading ? "Please wait..." : "Register"}
          </button>
        </form>

        <p className="text-center mt-6 text-slate-400">
          Already have account? <Link to="/login" className="text-cyan-400 font-semibold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;