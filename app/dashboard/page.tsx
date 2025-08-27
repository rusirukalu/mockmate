"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Bar,
  BarChart,
  Pie,
  PieChart,
  Cell,
} from "recharts";
import { useState } from "react";

// Mock user session/practice data
const mockSessions = [
  { date: "2025-08-20", minutes: 10, type: "Behavioral" },
  { date: "2025-08-21", minutes: 15, type: "Technical" },
  { date: "2025-08-22", minutes: 20, type: "System Design" },
  { date: "2025-08-23", minutes: 10, type: "Behavioral" },
  { date: "2025-08-24", minutes: 20, type: "Technical" },
  { date: "2025-08-25", minutes: 15, type: "Technical" },
];

const typeCount = [
  { name: "Behavioral", value: 2 },
  { name: "Technical", value: 3 },
  { name: "System Design", value: 1 },
];
const colors = ["#60a5fa", "#f59e42", "#34d399"];

export default function Dashboard() {
  const [sessions] = useState(mockSessions);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="font-bold text-2xl mb-4">Your Practice Dashboard</h1>
      <div className="grid gap-8 md:grid-cols-2">
        {/* Sessions Over Time (Line) */}
        <div className="bg-white rounded border shadow p-4">
          <h2 className="font-semibold mb-2">Sessions This Week</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={sessions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis unit="m" />
              <Tooltip />
              <Line
                dataKey="minutes"
                name="Minutes"
                stroke="#4f46e5"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Category Distribution (Pie) */}
        <div className="bg-white rounded border shadow p-4">
          <h2 className="font-semibold mb-2">Question Type Breakdown</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                dataKey="value"
                data={typeCount}
                innerRadius={40}
                outerRadius={80}
                label
              >
                {typeCount.map((entry, idx) => (
                  <Cell key={entry.name} fill={colors[idx % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Category by Minutes (Bar) */}
        <div className="bg-white rounded border shadow p-4 md:col-span-2">
          <h2 className="font-semibold mb-2">Time Spent by Category</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={Object.values(
                sessions.reduce((acc, curr) => {
                  acc[curr.type] = acc[curr.type] || {
                    type: curr.type,
                    total: 0,
                  };
                  acc[curr.type].total += curr.minutes;
                  return acc;
                }, {} as Record<string, { type: string; total: number }>)
              )}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis unit="m" />
              <Tooltip />
              <Bar dataKey="total" fill="#0891b2" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
