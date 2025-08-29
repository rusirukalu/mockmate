"use client";
import { useState, useEffect } from "react";

export default function OnboardingModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Only show if not seen
    if (
      typeof window !== "undefined" &&
      !localStorage.getItem("seen-onboarding")
    ) {
      setOpen(true);
    }
  }, []);

  function closeModal() {
    localStorage.setItem("seen-onboarding", "true");
    setOpen(false);
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white shadow-xl border rounded-lg w-full max-w-sm p-6 text-center relative">
        <h2 className="font-bold text-xl mb-3 text-blue-700">
          Welcome to MockMate!
        </h2>
        <p className="text-gray-700 mb-3">
          Practice interviews with AI feedback.
          <br />
          <strong>Step 1:</strong> Sign in.
          <br />
          <strong>Step 2:</strong> Go to <b>Practice</b> and answer timed random
          questions.
          <br />
          <strong>Step 3:</strong> Submit for instant AI review and track your
          progress!
        </p>
        <p className="text-gray-500 mb-5">
          You can customize questions, record video answers, and see your
          strengths over time.
        </p>
        <button
          className="bg-blue-600 text-white px-5 py-2 rounded font-semibold shadow hover:bg-blue-700 transition"
          onClick={closeModal}
        >
          Got it!
        </button>
      </div>
    </div>
  );
}
