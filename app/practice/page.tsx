"use client";
import { useState, useEffect, useRef } from "react";
import useSWR from "swr";
import Recorder from "@/app/components/features/Recorder";
import MarkdownFeedback from "@/app/components/features/MarkdownFeedback";
import CustomizationPanel from "@/app/components/practice/CustomizationPanel";
import { TIMER_BY_DIFFICULTY } from "@/lib/config";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

// ---------- LocalStorage history helper ----------
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

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Practice() {
  const [filterDifficulty, setFilterDifficulty] = useState("any");
  const [filterCategory, setFilterCategory] = useState("any");
  const [started, setStarted] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const [question, setQuestion] = useState<any>(null);

  const [answer, setAnswer] = useState("");
  const [aiFeedback, setAIFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackErr, setFeedbackErr] = useState("");
  const [lastRecordingUrl, setLastRecordingUrl] = useState<
    string | undefined
  >();

  const [newQ, setNewQ] = useState("");
  const [newQCat, setNewQCat] = useState("Behavioral");
  const [newQDiff, setNewQDiff] = useState("Easy");

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  // Fetch from DB
  const { data: questions, error } = useSWR(
    `/api/questions?category=${filterCategory}&difficulty=${filterDifficulty}`,
    fetcher
  );
  const allQuestions = questions || [];

  // Countdown
  useEffect(() => {
    if (!started) return;
    if (seconds === 0) return;
    const timer = setInterval(
      () => setSeconds((s) => (s > 0 ? s - 1 : 0)),
      1000
    );
    return () => clearInterval(timer);
  }, [started, seconds]);

  function pickNewQuestion() {
    const pick = allQuestions.length
      ? allQuestions[Math.floor(Math.random() * allQuestions.length)]
      : null;
    setQuestion(pick);
    setAnswer("");
    setAIFeedback(null);
    setFeedbackErr("");
    setLastRecordingUrl(undefined);

    if (pick) setSeconds(TIMER_BY_DIFFICULTY[pick.difficulty] || 60);
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
    setStarted(false); // stop timer

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.text, answer }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to get feedback");
      setAIFeedback(data.feedback);

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

          {!started && !question && (
            <>
              <CustomizationPanel
                filterDifficulty={filterDifficulty}
                setFilterDifficulty={setFilterDifficulty}
                filterCategory={filterCategory}
                setFilterCategory={setFilterCategory}
                newQ={newQ}
                setNewQ={setNewQ}
                newQCat={newQCat}
                setNewQCat={setNewQCat}
                newQDiff={newQDiff}
                setNewQDiff={setNewQDiff}
                handleAddCustomQ={() => {}}
              />
              <div className="text-center">
                <Button
                  onClick={pickNewQuestion}
                  size="lg"
                  className="px-8 py-4"
                >
                  Start Interview Session
                </Button>
              </div>
            </>
          )}

          {question && (
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

              {/* Question */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      Q
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">Interview Question</span>
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

              {/* Recorder */}
              <div className="text-sm text-gray-600">
                Choose one: <strong>Record</strong> (auto-transcribes) or{" "}
                <strong>type</strong> below.
              </div>
              <Recorder
                onTranscript={handleTranscript}
                onSave={(blob) =>
                  setLastRecordingUrl(URL.createObjectURL(blob))
                }
              />

              {/* Answer + Feedback */}
              <div className="space-y-3">
                <Label className="font-semibold text-gray-900">
                  Your Answer
                </Label>
                <Textarea
                  ref={textAreaRef}
                  rows={6}
                  className="font-mono resize-none"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  disabled={!started}
                  placeholder="Type here or use voice recording above..."
                />

                <div className="flex gap-3 flex-wrap">
                  <Button
                    onClick={handleAIFeedback}
                    disabled={isLoading || !answer.trim()}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>{" "}
                        Analyzing...
                      </>
                    ) : (
                      "Get AI Feedback"
                    )}
                  </Button>
                  <Button onClick={handleReset} variant="outline">
                    Reset Session
                  </Button>
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

          {/* History */}
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
