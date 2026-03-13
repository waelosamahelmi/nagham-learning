"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // TODO: Supabase auth login
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <motion.div
        className="w-full max-w-sm rounded-2xl border border-border-subtle bg-bg-secondary p-8"
        variants={fadeInUp}
        initial="initial"
        animate="animate"
      >
        <h1 className="font-heading text-3xl font-bold">NaghamOS</h1>
        <p className="mt-2 text-text-secondary">Welcome back</p>

        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm text-text-secondary"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-border-subtle bg-bg-tertiary px-4 py-2.5 text-text-primary outline-none transition-colors focus:border-figma"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm text-text-secondary"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-border-subtle bg-bg-tertiary px-4 py-2.5 text-text-primary outline-none transition-colors focus:border-figma"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-figma py-2.5 font-semibold text-white transition-shadow hover:shadow-[0_0_20px_rgba(162,89,255,0.4)] disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
