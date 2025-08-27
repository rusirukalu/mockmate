"use client";
import { useState, useEffect } from "react";
import Recorder from "@/app/components/features/Recorder";

// Mocked question bank, replace with DB/API fetch later!
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

  // Countdown timer
  useEffect(() => {
    if (!started) return;
    if (seconds === 0) return;

    const timer = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [started, seconds]);

  // Pick a question when session starts
  useEffect(() => {
    if (started && !question) {
      setQuestion(
        sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)]
      );
    }
  }, [started, question]);

  // Reset on finish
  function handleReset() {
    setStarted(false);
    setSeconds(60);
    setQuestion(null);
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Mock Interview Practice</h1>
      {!started ? (
        <button
          onClick={() => {
            setStarted(true);
            setSeconds(60);
          }}
          className="btn btn-primary"
        >
          Start Session
        </button>
      ) : (
        <div className="space-y-4">
          <div className="text-lg font-semibold">Time left: {seconds}s</div>
          {question && (
            <div className="mb-3 p-3 bg-gray-100 rounded shadow-inner border">
              <span className="font-medium">Question:</span>
              <div className="mt-1">{question.text}</div>
            </div>
          )}
          <Recorder />
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
    </div>
  );
}
