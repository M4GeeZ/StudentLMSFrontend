import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top_left,#0ea5e9,transparent_30%),linear-gradient(135deg,#020617,#0f172a,#111827)] px-4">
      <div className="absolute w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl top-10 left-10"></div>
      <div className="absolute w-72 h-72 bg-blue-600/20 rounded-full blur-3xl bottom-10 right-10"></div>

      <div className="card w-full max-w-md p-8 relative">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-3xl">
            🎓
          </div>
          <h1 className="text-4xl font-extrabold text-white">Welcome Back</h1>
          <p className="text-slate-400 mt-2">Login to manage student records</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="input" type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <button disabled={loading} className="btn-primary w-full">
            {loading ? "Please wait..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-6 text-slate-400">
          No account? <Link to="/register" className="text-cyan-400 font-semibold hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;