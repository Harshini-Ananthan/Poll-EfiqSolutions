"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { routeForUser, clearSession, storeUser } from "@/lib/auth";
import { api } from "@/lib/api";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";

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
      const session = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", session.access_token);
      storeUser(session.user);
      router.push(routeForUser(session.user));
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.message === "ACCOUNT_DISABLED") {
        clearSession();
        router.push("/account-disabled");
        return;
      }
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      localStorage.setItem("token", token);
      
      const user = await api.get("/auth/me");
      storeUser(user);
      router.push(routeForUser(user));
    } catch (err: any) {
      if (err.code === 'auth/cancelled-popup-request' || err.code === 'auth/popup-closed-by-user') {
        // User closed the popup or it was cancelled, not a real error
        return;
      }
      console.error("Google Login error:", err);
      if (err.message === "ACCOUNT_DISABLED" || err.code === "auth/user-disabled") {
        clearSession();
        router.push("/account-disabled");
        return;
      }
      setError(err.message || "Failed to sign in with Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 min-h-screen bg-[#1a1a1a]">
      <div className="w-full max-w-md bg-[#2a2a2a] p-8 rounded-2xl border border-[#333333]/50 shadow-2xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-orbitron font-bold text-white uppercase tracking-wide mb-3">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-400 font-manrope">
            Sign in to manage your WhatsApp polls
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-xs font-bold text-[#666] uppercase tracking-widest mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-[#444] bg-[#242424] px-4 py-3 text-sm text-gray-200 outline-none transition-colors placeholder:text-gray-500 focus:border-blue-500/60"
              placeholder="admin@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#666] uppercase tracking-widest mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-[#444] bg-[#242424] px-4 py-3 text-sm text-gray-200 outline-none transition-colors placeholder:text-gray-500 focus:border-blue-500/60"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400/50 text-white font-semibold py-3 flex items-center justify-center gap-2 rounded-lg transition-colors mt-6"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Sign In"}
          </button>
        </form>

        <div className="mt-8 flex items-center gap-4">
          <div className="flex-1 h-px bg-[#333333]"></div>
          <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">OR</span>
          <div className="flex-1 h-px bg-[#333333]"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="mt-6 w-full bg-[#242424] hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed border border-[#444] text-gray-200 font-semibold py-3 flex items-center justify-center gap-3 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
