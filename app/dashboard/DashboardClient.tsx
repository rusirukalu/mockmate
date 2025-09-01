"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Pie,
  PieChart,
  Cell,
} from "recharts";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import MarkdownFeedback from "@/app/components/features/MarkdownFeedback";

// --- Types ---
interface Session {
  timestamp: number;
  category: string;
  difficulty: string;
  question: string;
  answer: string;
  aiFeedback?: string;
  videoUrl?: string;
}

// Helper to get history from localStorage
function getPracticeHistory(): Session[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("practice-history");
  return stored ? JSON.parse(stored) : [];
}

const colors = ["#60a5fa", "#f59e42", "#34d399"];

export default function DashboardClient({ userEmail }: { userEmail: string }) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [topStrengths, setTopStrengths] = useState<string[]>([]);
  const [topImprovements, setTopImprovements] = useState<string[]>([]);
  const [recentSession, setRecentSession] = useState<Session | null>(null);

  useEffect(() => {
    const history = getPracticeHistory();
    setSessions(history);
    if (history.length) {
      setRecentSession(history[history.length - 1]);

      // Parse AI feedback markdown
      const strengths: string[] = [];
      const improvements: string[] = [];
      for (const s of history) {
        if (s.aiFeedback) {
          const sMatch = s.aiFeedback.match(/## Strengths\n((?:- .*\n?)+)/i);
          const iMatch = s.aiFeedback.match(
            /## Areas to Improve\n((?:- .*\n?)+)/i
          );
          if (sMatch) {
            strengths.push(
              ...sMatch[1]
                .trim()
                .split("\n")
                .map((l: string) => l.replace(/^- /, ""))
            );
          }
          if (iMatch) {
            improvements.push(
              ...iMatch[1]
                .trim()
                .split("\n")
                .map((l: string) => l.replace(/^- /, ""))
            );
          }
        }
      }
      function topN(arr: string[], n: number) {
        const freq = arr.reduce(
          (a, s) => ((a[s] = (a[s] || 0) + 1), a),
          {} as Record<string, number>
        );
        return Object.entries(freq)
          .sort((a, b) => b[1] - a[1])
          .slice(0, n)
          .map((x) => x[0]);
      }
      setTopStrengths(topN(strengths, 2));
      setTopImprovements(topN(improvements, 2));
    }
  }, []);

  // Chart data
  const byType = sessions.reduce((acc, curr) => {
    if (!curr || !curr.question) return acc;
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const byTypeData = Object.entries(byType).map(([type, value]) => ({
    name: type,
    value,
  }));

  // Sessions per day
  const sessionsByDay = sessions.reduce((acc, curr) => {
    const day = new Date(curr.timestamp).toLocaleDateString();
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const sessionsOverTime = Object.keys(sessionsByDay).map((date) => ({
    date,
    count: sessionsByDay[date],
  }));

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="font-bold text-2xl mb-4">Welcome {userEmail || "User"}</h1>

      <section className="mb-6 space-y-2">
        <div className="flex flex-wrap gap-4">
          <div className="bg-blue-50 rounded p-3">
            <div className="font-semibold text-blue-700 text-sm">
              Top Strengths
            </div>
            {topStrengths.length ? (
              <ul className="list-disc pl-4 mt-1 text-blue-800">
                {topStrengths.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-400">
                (Do more sessions for insights)
              </div>
            )}
          </div>
          <div className="bg-orange-50 rounded p-3">
            <div className="font-semibold text-orange-700 text-sm">
              Areas to Improve
            </div>
            {topImprovements.length ? (
              <ul className="list-disc pl-4 mt-1 text-orange-800">
                {topImprovements.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-400">
                (Do more sessions for insights)
              </div>
            )}
          </div>
        </div>
        <div className="mt-4">
          <a
            href="/practice/history"
            className="text-blue-600 underline hover:text-blue-800 font-semibold"
          >
            Review All Sessions
          </a>
        </div>

        <Button
          onClick={() => {
            if (
              window.confirm(
                "Delete ALL your practice history? This cannot be undone."
              )
            ) {
              localStorage.removeItem("practice-history");
              window.location.reload();
            }
          }}
          variant="outline"
          className="mt-5 py-2 px-4 rounded bg-red-50 border border-red-600 text-red-800 font-medium hover:bg-red-100"
          aria-label="Delete all practice data"
        >
          Delete All Practice History
        </Button>
      </section>

      <div className="grid gap-8 md:grid-cols-2 mb-8">
        {/* Sessions Over Time */}
        <div className="bg-white rounded border shadow p-4">
          <h2 className="font-semibold mb-2">Sessions Per Day</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={sessionsOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                dataKey="count"
                name="Sessions"
                stroke="#4f46e5"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Category Distribution */}
        <div className="bg-white rounded border shadow p-4">
          <h2 className="font-semibold mb-2">Question Category Breakdown</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                dataKey="value"
                data={byTypeData}
                innerRadius={40}
                outerRadius={80}
                label
              >
                {byTypeData.map((entry, idx) => (
                  <Cell key={entry.name} fill={colors[idx % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {recentSession && (
        <section className="mb-6">
          <div className="bg-white border shadow p-4 rounded">
            <div className="font-semibold text-base mb-2">
              Most Recent Session
            </div>
            <div className="text-sm text-gray-500 mb-1">
              {new Date(recentSession.timestamp).toLocaleString()} -{" "}
              {recentSession.category}, {recentSession.difficulty}
            </div>
            <div className="mb-1 font-semibold">
              Q: {recentSession.question}
            </div>
            <div className="mb-2">
              <span className="font-bold">Your answer:</span>
              <div className="bg-gray-100 p-2 rounded">
                {recentSession.answer}
              </div>
            </div>
            {recentSession.aiFeedback && (
              <div className="mb-2">
                <span className="font-bold">AI Feedback:</span>
                <MarkdownFeedback markdown={recentSession.aiFeedback} />
              </div>
            )}
            {recentSession.videoUrl && (
              <div className="my-2">
                <video
                  src={recentSession.videoUrl}
                  controls
                  className="w-full rounded bg-black"
                />
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
