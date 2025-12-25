"use client";
import { useEffect, useState } from "react";
import { AlertCircle, Clock, CheckCircle2, TrendingUp } from "lucide-react";

type Issue = {
  id: string;
  title: string;
  type: string;
  status: string;
  created_at: string;
  description: string;
};

export default function LiveIssues() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    resolved: 0,
  });
  const [pg, setPg] = useState(1);
  const [allData, setAllData] = useState<Issue[]>([]);
  const perPg = 9;

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const res = await fetch("/api/posts");
      if (res.ok) {
        const data = await res.json();
        const issueData = data.posts || [];
        setAllData(issueData);

        const start = (pg - 1) * perPg;
        const end = start + perPg;
        setIssues(issueData.slice(start, end));

        setStats({
          total: issueData.length,
          open: issueData.filter((i: Issue) => i.status === "open").length,
          resolved: issueData.filter((i: Issue) => i.status === "resolved")
            .length,
        });
      }
    } catch (err) {
      console.error("Failed to fetch issues");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (allData.length > 0) {
      const start = (pg - 1) * perPg;
      const end = start + perPg;
      setIssues(allData.slice(start, end));
    }
  }, [pg]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "in-progress":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      default:
        return "bg-red-500/10 text-red-500 border-red-500/20";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Cloud Security":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "VAPT":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      default:
        return "bg-cyan-500/10 text-cyan-500 border-cyan-500/20";
    }
  };

  const totalPgs = Math.ceil(allData.length / perPg);

  const goNext = () => {
    if (pg < totalPgs) setPg(pg + 1);
  };

  const goPrev = () => {
    if (pg > 1) setPg(pg - 1);
  };

  return (
    <section id="issues" className="py-20 px-4 gradient-bg">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Live <span className="text-green-500">Security</span> Dashboard
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-time tracking of security vulnerabilities across our platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Total Issues
                </p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="p-6 rounded-xl bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Open Issues
                </p>
                <p className="text-3xl font-bold">{stats.open}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Resolved</p>
                <p className="text-3xl font-bold">{stats.resolved}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 animate-spin mx-auto text-green-500" />
            <p className="mt-4 text-muted-foreground">Loading issues...</p>
          </div>
        ) : issues.length === 0 ? (
          <div className="text-center py-12 rounded-xl border border-green-500/20 bg-black/30">
            <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">
              No issues reported yet
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Be the first to report a security vulnerability
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {issues.map((issue) => (
              <div
                key={issue.id}
                className="p-6 rounded-xl bg-black/30 border border-green-500/20 hover:border-green-500/40 transition-all duration-300 hover:scale-105"
              >
                <div className="flex justify-between items-start mb-3">
                  <span
                    className={`text-xs px-3 py-1 rounded-full border ${getTypeColor(
                      issue.type
                    )}`}
                  >
                    {issue.type}
                  </span>
                  <span
                    className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(
                      issue.status
                    )}`}
                  >
                    {issue.status}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2 line-clamp-1">
                  {issue.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {issue.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(issue.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>
        )}

        {!loading && allData.length > perPg && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={goPrev}
              disabled={pg === 1}
              className="px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 hover:bg-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>
            <span className="text-sm text-muted-foreground">
              Page {pg} of {totalPgs}
            </span>
            <button
              onClick={goNext}
              disabled={pg === totalPgs}
              className="px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 hover:bg-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
