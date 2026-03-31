import React, { useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.access_token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-xl shadow-blue-900/5 ring-1 ring-slate-200">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-orbitron font-bold text-slate-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-sm text-slate-500 font-manrope">
            Sign in to manage your WhatsApp polls
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 font-manrope">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-lg animate-in fade-in slide-in-from-top-1">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors bg-white text-slate-900"
              placeholder="admin@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors bg-white text-slate-900"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 rounded-lg transition-colors mt-6 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
