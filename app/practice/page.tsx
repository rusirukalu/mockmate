"use client";
import { useState } from "react";
export default function Practice() {
  const [started, setStarted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  // TODO: Add question fetching, recording logic
  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">Mock Interview Practice</h1>
      {!started ? (
        <button
          onClick={() => {
            setStarted(true);
            setSeconds(60);
          }}
          className="btn"
        >
          Start Session
        </button>
      ) : (
        <div>
          <div className="text-lg">Time left: {seconds}s</div>
          {/* TODO: Show question & recording UI */}
        </div>
      )}
    </div>
  );
}
