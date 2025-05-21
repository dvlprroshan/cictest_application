import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import {
  IconAt,
  IconLock,
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
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
      const { data } = await api.post("/login", form); // { user, token }
      login(data);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md px-8 py-10 rounded-3xl bg-white/60 ring-1 ring-slate-200 backdrop-blur-sm transition-all duration-300 hover:ring-emerald-400"
      >
        <h1 className="mb-8 text-3xl font-extrabold tracking-tight text-center text-emerald-700">
          Sign in
        </h1>

        {error && (
          <p className="p-3 mb-6 text-sm text-red-700 bg-red-100 rounded-md">
            {error}
          </p>
        )}

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
            className="w-full py-3 pl-10 pr-4 text-sm tracking-wide bg-white/80 rounded-xl ring-1 ring-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Password */}
        <div className="relative mb-8">
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
            placeholder="••••••••"
            required
            className="w-full py-3 pl-10 pr-10 text-sm tracking-wide bg-white/80 rounded-xl ring-1 ring-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPwd((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-600 transition-colors"
          >
            {showPwd ? <IconEye size={18} /> : <IconEyeOff size={18} />}
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 font-semibold text-white rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:scale-[1.015] active:scale-100 transition-transform"
        >
          Continue
        </button>

        <p className="mt-6 text-sm text-center text-slate-700">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-emerald-700 underline-offset-2 hover:underline"
          >
            Create one
          </Link>
        </p>
      </form>
    </main>
  );
}
