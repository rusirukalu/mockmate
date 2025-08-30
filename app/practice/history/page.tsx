"use client";
import { useState, useEffect } from "react";
import MarkdownFeedback from "@/app/components/features/MarkdownFeedback";

type HistorySession = {
  timestamp: number;
  question: string;
  category: string;
  difficulty: string;
  videoUrl?: string;
  answer: string;
  aiFeedback: string;
};

export default function PracticeHistory() {
  const [history, setHistory] = useState<HistorySession[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("practice-history");
    if (stored) setHistory(JSON.parse(stored));
  }, []);

  if (!history?.length)
    return (
      <div className="max-w-md mx-auto p-8">
        <h1 className="text-xl font-bold mb-4">My Practice History</h1>
        <div className="text-gray-500">
          No sessions yet. Complete a practice session and AI review—your log
          will show up here!
        </div>
      </div>
    );

  // Show most recent first
  const sorted = [...history].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">My Practice History</h1>
      <ul className="space-y-6">
        {sorted.map((s, idx) => (
          <li
            key={s.timestamp + "-" + idx}
            className="border rounded-lg p-4 shadow bg-white"
          >
            <div className="text-sm text-gray-500 mb-2">
              {new Date(s.timestamp).toLocaleString()} &mdash;{" "}
              <span className="inline-block bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-xs">
                {s.category}
              </span>{" "}
              <span className="inline-block bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs">
                {s.difficulty}
              </span>
            </div>
            <div className="font-semibold mb-1">Q: {s.question}</div>
            <div className="mb-1">
              <span className="font-semibold">Your answer:</span>
              <div className="p-2" style={{ whiteSpace: "pre-wrap" }}>
                {s.answer || (
                  <span className="text-gray-400 italic">
                    (No answer typed)
                  </span>
                )}
              </div>
            </div>
            {s.videoUrl && (
              <div className="mb-2">
                <video
                  src={s.videoUrl}
                  controls
                  className="rounded w-full bg-black"
                />
              </div>
            )}
            {s.aiFeedback && (
              <div className="mb-2">
                <span className="font-semibold">AI Feedback:</span>
                <MarkdownFeedback markdown={s.aiFeedback} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
