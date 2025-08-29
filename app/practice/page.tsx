// app/practice/page.tsx
"use client";
import { useState, useEffect } from "react";
import Recorder from "@/app/components/features/Recorder";
import MarkdownFeedback from "@/app/components/features/MarkdownFeedback";

const sampleQuestions = [
  { id: 1, text: "Tell me about yourself." },
  { id: 2, text: "Describe a technical challenge you faced." },
  { id: 3, text: "How do you handle tight deadlines?" },
];

export default function Practice() {
  const [started, setStarted] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const [question, setQuestion] = useState<{ id: number; text: string } | null>(
    null
  );
  const [answer, setAnswer] = useState("");
  const [aiFeedback, setAIFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackErr, setFeedbackErr] = useState("");

  // Countdown timer with smooth updates
  useEffect(() => {
    if (!started || seconds === 0) return;
    const timer = setInterval(
      () => setSeconds((s) => Math.max(0, s - 1)),
      1000
    );
    return () => clearInterval(timer);
  }, [started, seconds]);

  // Pick question on start
  useEffect(() => {
    if (started && !question) {
      setQuestion(
        sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)]
      );
      setAnswer("");
      setAIFeedback(null);
      setFeedbackErr("");
    }
  }, [started, question]);

  function handleReset() {
    setStarted(false);
    setSeconds(60);
    setQuestion(null);
    setAnswer("");
    setAIFeedback(null);
    setFeedbackErr("");
  }

  async function handleAIFeedback() {
    if (!question || !answer.trim()) {
      setFeedbackErr("Please provide your answer before requesting feedback.");
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
    } catch (e: any) {
      setFeedbackErr(
        e.message || "Error getting AI feedback. Please try again."
      );
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
  const isSessionComplete = seconds === 0 && started;

  return (
    <div className="min-h-screen mt-10 bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-6">
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Mock Interview Practice
          </h1>

          {!started ? (
            <div className="text-center space-y-6">
              <p className="text-gray-600 text-lg">
                Ready to practice your interview skills?
              </p>
              <button
                onClick={() => setStarted(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-sm"
              >
                Start Interview Session
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Timer with enhanced styling */}
              <div className="text-center">
                <div
                  className={`text-4xl font-bold ${timeColor} transition-colors`}
                >
                  {Math.floor(seconds / 60)}:
                  {(seconds % 60).toString().padStart(2, "0")}
                </div>
                <div className="text-sm text-gray-500 mt-1">Time remaining</div>
              </div>

              {/* Question card with better visual treatment */}
              {question && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      Q
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Interview Question
                      </h3>
                      <p className="text-gray-800 text-lg leading-relaxed">
                        {question.text}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Recorder component */}
              <Recorder onTranscript={handleTranscript} />

              {/* Answer input with improved UX */}
              <div className="space-y-3">
                <label
                  htmlFor="ai-answer"
                  className="block font-semibold text-gray-900"
                >
                  Your Answer
                </label>
                <textarea
                  id="ai-answer"
                  rows={6}
                  className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-shadow"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer here or use voice recording above..."
                  disabled={seconds > 0 && started}
                />

                <div className="flex gap-3">
                  <button
                    onClick={handleAIFeedback}
                    disabled={isLoading || !answer.trim()}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Analyzing...
                      </>
                    ) : (
                      "Get AI Feedback"
                    )}
                  </button>

                  <button
                    onClick={handleReset}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Reset
                  </button>
                </div>

                {/* Error message with better styling */}
                {feedbackErr && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                    {feedbackErr}
                  </div>
                )}

                {/* AI Feedback with enhanced presentation */}
                {aiFeedback && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-4">
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
                  </div>
                )}
              </div>

              {/* Session complete message */}
              {isSessionComplete && (
                <div className="bg-blue-50 border border-blue-200 text-blue-800 px-6 py-4 rounded-lg text-center font-semibold">
                  🎉 Session Complete! Review your answer and get feedback
                  above.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
