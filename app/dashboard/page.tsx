"use client";

import { useState, useEffect } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  LogOut,
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
      const url =
        type && type !== "all" ? `/api/posts?type=${type}` : "/api/posts";

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

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/auth/login");
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
        body: JSON.stringify({
          email: user.email,
          title,
          desc: description,
          type,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create issue");
      }

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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: user.email }),
      });

      if (!res.ok) {
        throw new Error("Failed to delete issue");
      }

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
        body: JSON.stringify({
          email: user.email,
          status: newStatus,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      fetchIssues(token!);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    const token = localStorage.getItem("token");
    if (token) {
      fetchIssues(token, newFilter);
    }
  };

  const filteredIssues = issues;

  const stats = {
    cloudSecurity: issues.filter((i) => i.type === "Cloud Security").length,
    vapt: issues.filter((i) => i.type === "VAPT").length,
    reteam: issues.filter((i) => i.type === "Reteam Assessment").length,
    open: issues.filter((i) => i.status === "open").length,
    resolved: issues.filter((i) => i.status === "resolved").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="font-semibold">ApniSec Dashboard</div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user?.name || user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 text-red-600 text-sm p-3">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard
            label="Cloud Security"
            value={stats.cloudSecurity}
            icon={<AlertCircle className="w-8 h-8 text-blue-500" />}
          />
          <StatCard
            label="VAPT"
            value={stats.vapt}
            icon={<Clock className="w-8 h-8 text-yellow-500" />}
          />
          <StatCard
            label="Resolved"
            value={stats.resolved}
            icon={<CheckCircle2 className="w-8 h-8 text-green-500" />}
          />
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Issue Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track security issues
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            {showForm ? "Cancel" : "New Issue"}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleCreateIssue}
            className="mb-8 space-y-4 rounded-lg border p-4"
          >
            <input
              name="title"
              required
              placeholder="Issue title"
              className="w-full rounded border px-3 py-2"
            />

            <textarea
              name="description"
              required
              placeholder="Issue description"
              rows={4}
              className="w-full rounded border px-3 py-2"
            />

            <select
              name="type"
              required
              className="w-full rounded border px-3 py-2"
            >
              <option value="">Select issue type</option>
              <option value="Cloud Security">Cloud Security</option>
              <option value="Reteam Assessment">Reteam Assessment</option>
              <option value="VAPT">VAPT</option>
            </select>

            <button
              type="submit"
              disabled={formLoading}
              className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-60"
            >
              {formLoading ? "Creating..." : "Create Issue"}
            </button>
          </form>
        )}

        <div className="flex gap-2 mb-6 flex-wrap">
          {["all", "Cloud Security", "Reteam Assessment", "VAPT"].map((f) => (
            <button
              key={f}
              onClick={() => handleFilterChange(f)}
              className={`rounded-md border px-3 py-1 text-sm capitalize ${
                filter === f ? "bg-primary text-primary-foreground" : ""
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredIssues.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No issues found. Create your first issue!
            </div>
          ) : (
            filteredIssues.map((issue) => (
              <div key={issue.id} className="rounded-lg border p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold">{issue.title}</h3>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-600">
                        {issue.type}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          issue.status === "resolved"
                            ? "bg-green-500/10 text-green-600"
                            : issue.status === "in-progress"
                            ? "bg-yellow-500/10 text-yellow-600"
                            : "bg-gray-500/10 text-gray-600"
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
                      className="text-xs border rounded px-2 py-1"
                    >
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                    <button
                      onClick={() => handleDeleteIssue(issue.id)}
                      className="text-xs text-red-600 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {issue.description}
                </p>
                <p className="text-xs text-muted-foreground">
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
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border p-4 flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      {icon}
    </div>
  );
}
