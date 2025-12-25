"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, User, Lock, Mail, LayoutDashboard } from "lucide-react";

export default function ProfilePage() {
  const [usr, setUsr] = useState<any>(null);
  const [ld, setLd] = useState(true);
  const [nmLd, setNmLd] = useState(false);
  const [pwLd, setPwLd] = useState(false);
  const [err, setErr] = useState("");
  const [succ, setSucc] = useState("");
  const rtr = useRouter();

  useEffect(() => {
    const tk = localStorage.getItem("token");
    const usrData = localStorage.getItem("user");

    if (!tk) {
      rtr.push("/auth/login");
      return;
    }

    if (usrData) {
      setUsr(JSON.parse(usrData));
    }
    setLd(false);
  }, [rtr]);

  const updName = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNmLd(true);
    setErr("");
    setSucc("");

    const fd = new FormData(e.currentTarget);
    const nm = fd.get("name") as string;
    const tk = localStorage.getItem("token");

    try {
      const res = await fetch("/api/user/update-name", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tk}`,
        },
        body: JSON.stringify({ name: nm }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update name");
      }

      const updUsr = { ...usr, name: nm };
      setUsr(updUsr);
      localStorage.setItem("user", JSON.stringify(updUsr));
      setSucc("Name updated successfully!");
      e.currentTarget.reset();
    } catch (err: any) {
      setErr(err.message);
    } finally {
      setNmLd(false);
    }
  };

  const updPw = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPwLd(true);
    setErr("");
    setSucc("");

    const fd = new FormData(e.currentTarget);
    const oldPw = fd.get("oldPassword") as string;
    const newPw = fd.get("newPassword") as string;
    const confPw = fd.get("confirmPassword") as string;

    if (newPw !== confPw) {
      setErr("New passwords do not match");
      setPwLd(false);
      return;
    }

    if (newPw.length < 6) {
      setErr("Password must be at least 6 characters");
      setPwLd(false);
      return;
    }

    const tk = localStorage.getItem("token");

    try {
      const res = await fetch("/api/user/update-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tk}`,
        },
        body: JSON.stringify({
          email: usr.email,
          oldPassword: oldPw,
          newPassword: newPw,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update password");
      }

      setSucc("Password updated successfully!");
      e.currentTarget.reset();
    } catch (err: any) {
      setErr(err.message);
    } finally {
      setPwLd(false);
    }
  };

  if (ld) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-24 pb-12">
      <main className="max-w-4xl mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Profile Settings
            </h1>
            <p className="text-slate-400">
              Manage your account and preferences
            </p>
          </div>
          <button
            onClick={() => rtr.push("/dashboard")}
            className="flex items-center gap-2 rounded-lg bg-green-600/20 hover:bg-green-600/30 px-4 py-2 text-sm font-medium text-white transition-colors border border-green-500/20"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>
        </div>

        {err && (
          <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 backdrop-blur-sm">
            {err}
          </div>
        )}

        {succ && (
          <div className="mb-6 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm p-4 backdrop-blur-sm">
            {succ}
          </div>
        )}

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                <User className="w-5 h-5 text-green-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">
                Account Information
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                <User className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Name</p>
                  <p className="font-medium text-white">
                    {usr?.name || "Not set"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                <Mail className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="font-medium text-white">{usr?.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                <User className="w-5 h-5 text-green-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Update Name</h2>
            </div>
            <form onSubmit={updName} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-white"
                >
                  New Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Enter your new name"
                  defaultValue={usr?.name || ""}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3 text-white placeholder:text-slate-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                />
              </div>
              <button
                type="submit"
                disabled={nmLd}
                className="rounded-lg bg-green-600 hover:bg-green-700 px-6 py-3 text-sm font-medium text-white transition-colors disabled:opacity-50"
              >
                {nmLd ? "Updating..." : "Update Name"}
              </button>
            </form>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                <Lock className="w-5 h-5 text-green-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">
                Change Password
              </h2>
            </div>
            <form onSubmit={updPw} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="oldPassword"
                  className="text-sm font-medium text-white"
                >
                  Current Password
                </label>
                <input
                  id="oldPassword"
                  name="oldPassword"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3 text-white placeholder:text-slate-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="newPassword"
                  className="text-sm font-medium text-white"
                >
                  New Password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3 text-white placeholder:text-slate-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-white"
                >
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3 text-white placeholder:text-slate-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                />
              </div>

              <button
                type="submit"
                disabled={pwLd}
                className="rounded-lg bg-green-600 hover:bg-green-700 px-6 py-3 text-sm font-medium text-white transition-colors disabled:opacity-50"
              >
                {pwLd ? "Updating..." : "Change Password"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
