import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import {
  IconUser,
  IconAt,
  IconLock,
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  // @ts-ignore
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/register", form); // { user, token }
      login(data);
      navigate("/");
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        Object.values(err.response?.data?.errors || {}).flat()[0] ||
        "Something went wrong";
      setError(msg);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md px-8 py-10 rounded-3xl bg-white/60 ring-1 ring-slate-200 backdrop-blur-sm transition-all duration-300 hover:ring-emerald-400"
      >
        <h1 className="mb-8 text-3xl font-extrabold tracking-tight text-center text-emerald-700">
          Create account
        </h1>

        {error && (
          <p className="p-3 mb-6 text-sm text-red-700 bg-red-100 rounded-md">
            {error}
          </p>
        )}

        {/* Name */}
        <div className="relative mb-6">
          <IconUser
            size={20}
            stroke={1.8}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none"
          />
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            required
            className="w-full py-3 pl-10 pr-4 text-sm bg-white/80 rounded-xl ring-1 ring-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Email */}
        <div className="relative mb-6">
          <IconAt
            size={20}
            stroke={1.8}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
            className="w-full py-3 pl-10 pr-4 text-sm bg-white/80 rounded-xl ring-1 ring-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Password */}
        <div className="relative mb-6">
          <IconLock
            size={20}
            stroke={1.8}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none"
          />
          <input
            type={showPwd ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Create password"
            required
            className="w-full py-3 pl-10 pr-10 text-sm bg-white/80 rounded-xl ring-1 ring-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPwd((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-600 transition-colors"
          >
            {showPwd ? <IconEye size={18} /> : <IconEyeOff size={18} />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative mb-8">
          <IconLock
            size={20}
            stroke={1.8}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none"
          />
          <input
            type={showPwd2 ? "text" : "password"}
            name="password_confirmation"
            value={form.password_confirmation}
            onChange={handleChange}
            placeholder="Confirm password"
            required
            className="w-full py-3 pl-10 pr-10 text-sm bg-white/80 rounded-xl ring-1 ring-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPwd2((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-600 transition-colors"
          >
            {showPwd2 ? <IconEye size={18} /> : <IconEyeOff size={18} />}
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 font-semibold text-white rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:scale-[1.015] active:scale-100 transition-transform"
        >
          Sign up
        </button>

        <p className="mt-6 text-sm text-center text-slate-700">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-emerald-700 underline-offset-2 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </main>
  );
}
