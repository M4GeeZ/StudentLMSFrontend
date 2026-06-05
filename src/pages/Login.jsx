import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    if (role === "admin") {
      if (email === "thorm3821@gmail.com" && password === "r98@RtRh") {
        localStorage.setItem("userRole", "admin");
        localStorage.setItem(
          "adminUser",
          JSON.stringify({
            name: "Admin",
            email: "thorm3821@gmail.com",
            role: "admin",
          })
        );
        if (
  email === "thorm3821@gmail.com" &&
  password === "r98@RtRh" &&
  role !== "admin"
) {
  toast.error("Admin account can only login as Admin");
  setLoading(false);
  return;
}

        toast.success("Admin login successful");
        navigate("/admin-dashboard");
        return;
      } else {
        toast.error("Invalid admin credentials");
        return;
      }
    }

    await login(email, password);

    localStorage.setItem("userRole", role);

    toast.success("Login successful");

    if (role === "student") {
      navigate("/student-portal");
    } else {
      navigate("/dashboard");
    }
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

          <h1 className="text-4xl font-extrabold text-white">
            Welcome Back
          </h1>

          <p className="text-slate-400 mt-2">
            Login to manage student records
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="grid grid-cols-3 gap-3 mb-4">
  <button
    type="button"
    onClick={() => setRole("admin")}
    className={`py-3 rounded-xl font-semibold border transition ${
      role === "admin"
        ? "bg-blue-600 text-white border-blue-600"
        : "bg-white text-black border-slate-300"
    }`}
  >
    Admin
  </button>

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

          <input
            className="input"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="relative">
            <input
              className="input pr-12"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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

          <button disabled={loading} className="btn-primary w-full">
            {loading ? "Please wait..." : "Login"}
          </button>
        </form>

        {role !== "admin" && (
  <p className="text-center mt-6 text-slate-400">
    No account?{" "}
    <Link
      to="/register"
      className="text-cyan-400 font-semibold hover:underline"
    >
      Register
    </Link>
  </p>
)}

      </div>
    </div>
  );
};

export default Login;