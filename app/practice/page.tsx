"use client";
import { useState, useEffect, useRef } from "react";
import Recorder from "@/app/components/features/Recorder";
import MarkdownFeedback from "@/app/components/features/MarkdownFeedback";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

  const [filterDifficulty, setFilterDifficulty] = useState<string>("any");
  const [filterCategory, setFilterCategory] = useState<string>("any");
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

  // Ref for Textarea auto-focus
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

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
      pickNewQuestion();
    }
  }, [started, question, filterCategory, filterDifficulty, customQuestions]);

  // Auto-focus Textarea when session starts
  useEffect(() => {
    if (started && textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [started]);

  function pickNewQuestion() {
    const allQuestions = [...starterQuestions, ...customQuestions];
    const choices = allQuestions.filter(
      (q) =>
        (filterCategory === "any" || q.category === filterCategory) &&
        (filterDifficulty === "any" || q.difficulty === filterDifficulty)
    );
    const pick = choices.length
      ? choices[Math.floor(Math.random() * choices.length)]
      : null;
    setQuestion(pick || null);
    setAnswer("");
    setAIFeedback(null);
    setFeedbackErr("");
    setLastRecordingUrl(undefined);
    setSeconds(60);
    setStarted(true);
  }

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

    // ✅ Stop the timer at current value
    setStarted(false);

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

  const timeColor =
    seconds <= 10
      ? "text-red-500"
      : seconds <= 30
      ? "text-amber-500"
      : "text-green-600";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-6">
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Mock Interview Practice
          </h1>

          {/* -- Customization Controls -- */}
          {!started && !question && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">
                  Customize Your Practice
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Difficulty & Category */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="difficulty-select">Difficulty:</Label>
                    <Select
                      value={filterDifficulty}
                      onValueChange={setFilterDifficulty}
                    >
                      <SelectTrigger
                        id="difficulty-select"
                        className="w-[120px]"
                      >
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        {DIFFICULTIES.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category-select">Category:</Label>
                    <Select
                      value={filterCategory}
                      onValueChange={setFilterCategory}
                    >
                      <SelectTrigger id="category-select" className="w-[140px]">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        {CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Add Custom Question */}
                <form onSubmit={handleAddCustomQ} className="space-y-3">
                  <Label className="text-base font-semibold">
                    Add Your Own Question
                  </Label>
                  <Input
                    type="text"
                    placeholder="e.g. Pitch yourself in 30 seconds"
                    value={newQ}
                    onChange={(e) => setNewQ(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Select value={newQCat} onValueChange={setNewQCat}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={newQDiff} onValueChange={setNewQDiff}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DIFFICULTIES.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button type="submit" variant="secondary">
                      + Add
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {!started && !question ? (
            <div className="text-center">
              <Button onClick={pickNewQuestion} size="lg" className="px-8 py-4">
                Start Interview Session
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Timer */}
              <div className="text-center">
                <div
                  className={`text-4xl font-bold ${timeColor} transition-colors`}
                >
                  {Math.floor(seconds / 60)}:
                  {(seconds % 60).toString().padStart(2, "0")}
                </div>
                <div className="text-sm text-gray-500 mt-1">Time remaining</div>
              </div>

              {/* Question Display */}
              {question ? (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                        Q
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">
                            Interview Question
                          </span>
                          <Badge variant="secondary">{question.category}</Badge>
                          <Badge variant="outline">{question.difficulty}</Badge>
                        </div>
                        <p className="text-gray-800 text-lg leading-relaxed">
                          {question.text}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Alert variant="destructive">
                  <AlertDescription>
                    No questions match your filters. Add custom questions or
                    reset filters.
                  </AlertDescription>
                </Alert>
              )}

              {/* Two clear options */}
              <div className="text-sm text-gray-600 mb-2">
                Choose one: <strong>Record (auto-transcribes)</strong> or{" "}
                <strong>type your answer</strong>.
              </div>

              <Recorder
                onTranscript={handleTranscript}
                onSave={(blob) =>
                  setLastRecordingUrl(URL.createObjectURL(blob))
                }
              />

              {/* Answer Input */}
              <div className="space-y-3">
                <Label
                  htmlFor="ai-answer"
                  className="font-semibold text-gray-900"
                >
                  Your Answer
                </Label>
                <Textarea
                  ref={textAreaRef}
                  id="ai-answer"
                  rows={6}
                  className="font-mono resize-none"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer here or use voice recording above..."
                  disabled={!started}
                />

                <div className="flex gap-3 flex-wrap">
                  <Button
                    onClick={handleAIFeedback}
                    disabled={isLoading || !answer.trim() || !question}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Analyzing...
                      </>
                    ) : (
                      "Get AI Feedback"
                    )}
                  </Button>

                  <Button onClick={handleReset} variant="outline">
                    Reset Session
                  </Button>

                  {/* ✅ Next Question Button (only if feedback is done) */}
                  {aiFeedback && (
                    <Button onClick={pickNewQuestion} variant="secondary">
                      Next Question →
                    </Button>
                  )}
                </div>

                {feedbackErr && (
                  <Alert variant="destructive">
                    <AlertDescription>{feedbackErr}</AlertDescription>
                  </Alert>
                )}

                {aiFeedback && (
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                          AI
                        </div>
                        <h3 className="font-bold text-green-900">
                          Feedback & Suggestions
                        </h3>
                      </div>
                      <div className="prose prose-sm max-w-none text-gray-800">
                        <MarkdownFeedback markdown={aiFeedback} />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* History Navigation */}
          <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <Link href="/practice/history">View History</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
