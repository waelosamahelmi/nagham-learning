"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      window.location.href = "/dashboard";
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <motion.div
        className="w-full max-w-sm rounded-2xl border border-border-subtle bg-bg-secondary p-8"
        variants={fadeInUp}
        initial="initial"
        animate="animate"
      >
        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold">NaghamOS</h1>
          <p className="mt-2 text-text-secondary">
            Creative Growth Engine
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-text-secondary"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="nagham@helmies.fi"
              className="w-full rounded-lg border border-border-subtle bg-bg-tertiary px-4 py-2.5 text-text-primary placeholder:text-text-tertiary outline-none transition-all focus:border-figma focus:shadow-[0_0_10px_rgba(162,89,255,0.15)]"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-text-secondary"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-border-subtle bg-bg-tertiary px-4 py-2.5 text-text-primary outline-none transition-all focus:border-figma focus:shadow-[0_0_10px_rgba(162,89,255,0.15)]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-figma py-2.5 font-semibold text-white transition-all hover:shadow-[0_0_20px_rgba(162,89,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-text-tertiary">
          Built with love by Helmies Oy
        </p>
      </motion.div>
    </div>
  );
}
