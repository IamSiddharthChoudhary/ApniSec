"use client";

import { useState, useEffect } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  Plus,
  Filter,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";

type Issue = {
  id: string;
  title: string;
  type: string;
  status: string;
  created_at: string;
  description: string;
  email: string;
};

export default function DashboardPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
      router.push("/auth/login");
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }

    fetchIssues(token);
  }, [router]);

  const fetchIssues = async (token: string, type?: string) => {
    try {
      const userEmail = JSON.parse(localStorage.getItem("user") || "{}").email;
      const baseUrl = `/api/posts?email=${userEmail}`;
      const url = type && type !== "all" ? `${baseUrl}&type=${type}` : baseUrl;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push("/auth/login");
          return;
        }
        throw new Error("Failed to fetch issues");
      }

      const data = await res.json();
      setIssues(data.posts || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIssue = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const token = localStorage.getItem("token");

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const type = formData.get("type") as string;

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, type }),
      });

      if (!res.ok) throw new Error("Failed to create issue");

      setShowForm(false);
      e.currentTarget.reset();
      fetchIssues(token!);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteIssue = async (id: string) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete issue");
      fetchIssues(token!);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");
      fetchIssues(token!);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    const token = localStorage.getItem("token");
    if (token) fetchIssues(token, newFilter);
  };

  const stats = {
    total: issues.length,
    cloudSecurity: issues.filter((i) => i.type === "Cloud Security").length,
    vapt: issues.filter((i) => i.type === "VAPT").length,
    reteam: issues.filter((i) => i.type === "Reteam Assessment").length,
    open: issues.filter((i) => i.status === "open").length,
    inProgress: issues.filter((i) => i.status === "in-progress").length,
    resolved: issues.filter((i) => i.status === "resolved").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-24 pb-12">
      <main className="max-w-7xl mx-auto px-4">
        {error && (
          <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 backdrop-blur-sm">
            {error}
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {user?.name || "User"}
          </h1>
          <p className="text-slate-400">
            Track and manage your security issues
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Issues"
            value={stats.total}
            icon={<AlertCircle className="w-6 h-6 text-blue-400" />}
            color="blue"
          />
          <StatCard
            label="Open"
            value={stats.open}
            icon={<Clock className="w-6 h-6 text-yellow-400" />}
            color="yellow"
          />
          <StatCard
            label="In Progress"
            value={stats.inProgress}
            icon={<Clock className="w-6 h-6 text-orange-400" />}
            color="orange"
          />
          <StatCard
            label="Resolved"
            value={stats.resolved}
            icon={<CheckCircle2 className="w-6 h-6 text-green-400" />}
            color="green"
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-white">Security Issues</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 rounded-lg bg-green-600 hover:bg-green-700 px-4 py-2.5 text-sm font-medium text-white transition-colors"
          >
            <Plus className="w-4 h-4" />
            {showForm ? "Cancel" : "New Issue"}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleCreateIssue}
            className="mb-8 space-y-4 rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-6"
          >
            <input
              name="title"
              required
              placeholder="Issue title"
              className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3 text-white placeholder:text-slate-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
            />

            <textarea
              name="description"
              required
              placeholder="Describe the security issue..."
              rows={4}
              className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3 text-white placeholder:text-slate-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
            />

            <select
              name="type"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3 text-white focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
            >
              <option value="">Select issue type</option>
              <option value="Cloud Security">Cloud Security</option>
              <option value="Reteam Assessment">Reteam Assessment</option>
              <option value="VAPT">VAPT</option>
            </select>

            <button
              type="submit"
              disabled={formLoading}
              className="rounded-lg bg-green-600 hover:bg-green-700 px-6 py-3 text-sm font-medium text-white transition-colors disabled:opacity-50"
            >
              {formLoading ? "Creating..." : "Create Issue"}
            </button>
          </form>
        )}

        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <Filter className="w-4 h-4 text-slate-400" />
          {["all", "Cloud Security", "Reteam Assessment", "VAPT"].map((f) => (
            <button
              key={f}
              onClick={() => handleFilterChange(f)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-green-600 text-white"
                  : "bg-slate-800/50 text-slate-300 hover:bg-slate-800 border border-slate-700"
              }`}
            >
              {f === "all" ? "All Issues" : f}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {issues.length === 0 ? (
            <div className="text-center py-16 rounded-xl border border-slate-800 bg-slate-900/30 backdrop-blur-sm">
              <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">
                No issues found. Create your first issue!
              </p>
            </div>
          ) : (
            issues.map((issue) => (
              <div
                key={issue.id}
                className="rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-6 space-y-4 hover:border-slate-700 transition-colors"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-white mb-2">
                      {issue.title}
                    </h3>
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {issue.type}
                      </span>
                      <span
                        className={`text-xs px-3 py-1 rounded-full border ${
                          issue.status === "resolved"
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : issue.status === "in-progress"
                            ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                            : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                        }`}
                      >
                        {issue.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={issue.status}
                      onChange={(e) =>
                        handleUpdateStatus(issue.id, e.target.value)
                      }
                      className="text-sm border border-slate-700 bg-slate-800 text-white rounded-lg px-3 py-1.5 focus:border-green-500 focus:outline-none"
                    >
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                    <button
                      onClick={() => handleDeleteIssue(issue.id)}
                      className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {issue.description}
                </p>
                <p className="text-xs text-slate-500">
                  Created: {new Date(issue.created_at).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: "from-blue-500/10 to-blue-600/5 border-blue-500/20",
    yellow: "from-yellow-500/10 to-yellow-600/5 border-yellow-500/20",
    orange: "from-orange-500/10 to-orange-600/5 border-orange-500/20",
    green: "from-green-500/10 to-green-600/5 border-green-500/20",
  };

  return (
    <div
      className={`rounded-xl border backdrop-blur-sm p-6 bg-gradient-to-br ${colorClasses[color]}`}
    >
      <div className="flex items-center justify-between mb-3">
        {icon}
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  );
}
