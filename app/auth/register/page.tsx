"use client";
import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, Mail, Lock, User } from "lucide-react";

export default function RegisterPage() {
  const [ld, setLd] = useState(false);
  const [err, setErr] = useState("");
  const rtr = useRouter();

  const hndlSub = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLd(true);
    setErr("");

    const fd = new FormData(e.currentTarget);
    const nm = fd.get("name") as string;
    const eml = fd.get("email") as string;
    const pw = fd.get("password") as string;
    const confPw = fd.get("confirmPassword") as string;

    if (pw !== confPw) {
      setErr("Passwords do not match");
      setLd(false);
      return;
    }

    if (pw.length < 6) {
      setErr("Password must be at least 6 characters");
      setLd(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nm, email: eml, password: pw }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      rtr.push("/dashboard");
    } catch (err: any) {
      setErr(err.message || "Registration failed. Please try again.");
    } finally {
      setLd(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 mt-14">
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-slate-400">
            Join ApniSec to protect your enterprise
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-8">
          <form onSubmit={hndlSub} className="space-y-5">
            {err && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3">
                {err}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-white">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/50 pl-11 pr-4 py-3 text-white placeholder:text-slate-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-white">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@company.com"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/50 pl-11 pr-4 py-3 text-white placeholder:text-slate-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-white"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/50 pl-11 pr-4 py-3 text-white placeholder:text-slate-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-white"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/50 pl-11 pr-4 py-3 text-white placeholder:text-slate-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={ld}
              className="w-full rounded-lg bg-green-600 hover:bg-green-700 px-4 py-3 text-sm font-medium text-white transition-colors disabled:opacity-50"
            >
              {ld ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-slate-400">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-green-400 hover:text-green-300 font-medium"
              >
                Sign in
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
