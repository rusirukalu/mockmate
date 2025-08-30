"use client";
import { useState, useEffect } from "react";
import Recorder from "@/app/components/features/Recorder";
import MarkdownFeedback from "@/app/components/features/MarkdownFeedback";

// Starter bank—can later migrate to DB or API!
const starterQuestions = [
  {
    id: 1,
    text: "Tell me about yourself.",
    category: "Behavioral",
    difficulty: "Easy",
  },
  {
    id: 2,
    text: "Describe a technical challenge you faced.",
    category: "Technical",
    difficulty: "Medium",
  },
  {
    id: 3,
    text: "How do you handle tight deadlines?",
    category: "Behavioral",
    difficulty: "Medium",
  },
  {
    id: 4,
    text: "Explain a complex system you designed.",
    category: "System Design",
    difficulty: "Hard",
  },
  {
    id: 5,
    text: "How would you debug a memory leak in production?",
    category: "Technical",
    difficulty: "Hard",
  },
];

const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const CATEGORIES = ["Behavioral", "Technical", "System Design"];

// ---------- Helper to save session to history ----------
function saveSessionToHistory({
  question,
  category,
  difficulty,
  videoUrl,
  answer,
  aiFeedback,
}: {
  question: string;
  category: string;
  difficulty: string;
  videoUrl?: string;
  answer: string;
  aiFeedback: string;
}) {
  if (typeof window === "undefined") return;
  const stored = localStorage.getItem("practice-history");
  const sessions = stored ? JSON.parse(stored) : [];
  sessions.push({
    timestamp: Date.now(),
    question,
    category,
    difficulty,
    videoUrl,
    answer,
    aiFeedback,
  });
  localStorage.setItem("practice-history", JSON.stringify(sessions));
}

export default function Practice() {
  const [customQuestions, setCustomQuestions] = useState<
    { id: number; text: string; category: string; difficulty: string }[]
  >([]);

  const [filterDifficulty, setFilterDifficulty] = useState<string | "">("");
  const [filterCategory, setFilterCategory] = useState<string | "">("");
  const [started, setStarted] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const [question, setQuestion] = useState<{
    id: number;
    text: string;
    category: string;
    difficulty: string;
  } | null>(null);

  // AI Feedback State
  const [answer, setAnswer] = useState("");
  const [aiFeedback, setAIFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackErr, setFeedbackErr] = useState("");

  // Track latest video blob URL
  const [lastRecordingUrl, setLastRecordingUrl] = useState<
    string | undefined
  >();

  // --- Custom question adding ---
  const [newQ, setNewQ] = useState("");
  const [newQCat, setNewQCat] = useState(CATEGORIES[0]);
  const [newQDiff, setNewQDiff] = useState(DIFFICULTIES[0]);

  // Persist custom questions per user session (optional)
  useEffect(() => {
    const stored =
      typeof window !== "undefined"
        ? localStorage.getItem("custom-questions")
        : null;
    if (stored) setCustomQuestions(JSON.parse(stored));
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined")
      localStorage.setItem("custom-questions", JSON.stringify(customQuestions));
  }, [customQuestions]);

  // Countdown timer
  useEffect(() => {
    if (!started) return;
    if (seconds === 0) return;
    const timer = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [started, seconds]);

  // Pick a filtered question when session starts
  useEffect(() => {
    if (started && !question) {
      const allQuestions = [...starterQuestions, ...customQuestions];
      const choices = allQuestions.filter(
        (q) =>
          (!filterCategory || q.category === filterCategory) &&
          (!filterDifficulty || q.difficulty === filterDifficulty)
      );
      const pick = choices.length
        ? choices[Math.floor(Math.random() * choices.length)]
        : null;
      setQuestion(pick || null);
      setAnswer("");
      setAIFeedback(null);
      setFeedbackErr("");
      setLastRecordingUrl(undefined);
    }
  }, [started, question, filterCategory, filterDifficulty, customQuestions]);

  function handleReset() {
    setStarted(false);
    setSeconds(60);
    setQuestion(null);
    setAnswer("");
    setAIFeedback(null);
    setFeedbackErr("");
    setLastRecordingUrl(undefined);
  }

  // --- SAVE session after feedback ---
  async function handleAIFeedback() {
    if (!question || !answer.trim()) {
      setFeedbackErr(
        "Type or transcribe your answer before requesting AI feedback."
      );
      return;
    }
    setIsLoading(true);
    setFeedbackErr("");
    setAIFeedback(null);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.text, answer }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to get feedback");
      setAIFeedback(data.feedback);

      // SAVE SESSION TO HISTORY after AI feedback
      saveSessionToHistory({
        question: question.text,
        category: question.category,
        difficulty: question.difficulty,
        videoUrl: lastRecordingUrl,
        answer,
        aiFeedback: data.feedback,
      });
    } catch (e: any) {
      setFeedbackErr(e.message || "Error contacting AI service.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleTranscript(transcript: string) {
    setAnswer(transcript);
  }

  // Add new custom question (with basic validation)
  function handleAddCustomQ(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = newQ.trim();
    if (!trimmed) return;
    setCustomQuestions((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: trimmed,
        category: newQCat,
        difficulty: newQDiff,
      },
    ]);
    setNewQ("");
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Mock Interview Practice</h1>

      {/* -- Customization Controls -- */}
      {!started && (
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-wrap">
            <label className="font-semibold">
              Difficulty:
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="ml-2 border rounded px-2 py-1"
              >
                <option value="">Any</option>
                {DIFFICULTIES.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </label>
            <label className="font-semibold">
              Category:
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="ml-2 border rounded px-2 py-1"
              >
                <option value="">Any</option>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
          </div>

          <form
            className="flex flex-col gap-2 mt-2"
            onSubmit={handleAddCustomQ}
          >
            <h3 className="font-semibold text-base">Add Your Own Question</h3>
            <input
              type="text"
              placeholder="e.g. Pitch yourself in 30 seconds"
              value={newQ}
              onChange={(e) => setNewQ(e.target.value)}
              className="border rounded px-2 py-1"
            />
            <div className="flex gap-2">
              <select
                value={newQCat}
                onChange={(e) => setNewQCat(e.target.value)}
                className="border rounded px-2 py-1"
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <select
                value={newQDiff}
                onChange={(e) => setNewQDiff(e.target.value)}
                className="border rounded px-2 py-1"
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
              <button className="btn btn-secondary px-3" type="submit">
                + Add
              </button>
            </div>
          </form>
        </div>
      )}

      {!started ? (
        <button
          onClick={() => {
            setStarted(true);
            setSeconds(60);
          }}
          className="btn btn-primary my-4"
        >
          Start Session
        </button>
      ) : (
        <div className="space-y-4">
          <div className="text-lg font-semibold">Time left: {seconds}s</div>
          {question ? (
            <div className="mb-3 p-3 bg-gray-100 rounded shadow-inner border">
              <div>
                <span className="font-medium">Question:</span>{" "}
                <span className="inline-block bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-xs ml-1">
                  {question.category}
                </span>
                <span className="inline-block bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs ml-1">
                  {question.difficulty}
                </span>
              </div>
              <div className="mt-1">{question.text}</div>
            </div>
          ) : (
            <div className="text-red-600 font-semibold">
              No questions match your filters. Add custom or reset filters.
            </div>
          )}

          <Recorder
            onTranscript={handleTranscript}
            onSave={(blob) => {
              setLastRecordingUrl(URL.createObjectURL(blob));
            }}
          />
          <div className="flex flex-col gap-2 mt-4">
            <label className="font-mono font-semibold" htmlFor="ai-answer">
              Type or auto-transcribe your answer for AI feedback:
            </label>
            <textarea
              id="ai-answer"
              rows={4}
              className="border rounded p-2 font-mono"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="e.g. My name is... In my previous job..."
              disabled={seconds > 0 && started}
            />

            <button
              className="btn btn-blue"
              onClick={handleAIFeedback}
              disabled={isLoading || !answer.trim() || !question}
            >
              {isLoading ? "Getting AI Feedback..." : "Get AI Feedback"}
            </button>
            {feedbackErr && <div className="text-red-600">{feedbackErr}</div>}
            {aiFeedback && (
              <div className="bg-gray-50 border rounded p-3 mt-2 prose max-w-none">
                <h3 className="font-semibold text-base mb-1">AI Feedback:</h3>
                <MarkdownFeedback markdown={aiFeedback} />
              </div>
            )}
          </div>
          <button onClick={handleReset} className="btn btn-light mt-2">
            Reset Session
          </button>
          {seconds === 0 && (
            <div className="mt-2 text-green-600 font-bold">
              Session complete! Review your recording above.
            </div>
          )}
        </div>
      )}
      {/* Optional: History link for navigation */}
      <div className="mt-6 text-right">
        <a
          href="/practice/history"
          className="text-blue-700 underline hover:text-blue-900 font-medium"
        >
          View History
        </a>
      </div>
    </div>
  );
}
