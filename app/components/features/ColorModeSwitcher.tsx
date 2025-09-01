"use client";
import { useEffect, useState } from "react";

/**
 * Simple light/dark/theme toggle for accessibility.
 * Remembers user preference in localStorage.
 */
export default function ColorModeSwitcher() {
  const [mode, setMode] = useState<"light" | "dark" | "system">("system");

  useEffect(() => {
    const saved =
      typeof window !== "undefined" ? localStorage.getItem("color-mode") : null;
    if (saved === "dark" || saved === "light") setMode(saved);
    else setMode("system");
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const html = document.documentElement;
    if (
      mode === "dark" ||
      (mode === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
    localStorage.setItem("color-mode", mode);
  }, [mode]);

  return (
    <div
      className="flex gap-2 items-center"
      role="group"
      aria-label="Color theme selector"
    >
      <span className="sr-only">Color mode</span>
      <button
        onClick={() => setMode("light")}
        className={`p-2 rounded ${mode === "light" ? "bg-blue-100" : ""}`}
        aria-label="Light mode"
        title="Light mode"
      >
        <span role="img" aria-label="sun">
          🌞
        </span>
      </button>
      <button
        onClick={() => setMode("dark")}
        className={`p-2 rounded ${mode === "dark" ? "bg-blue-100" : ""}`}
        aria-label="Dark mode"
        title="Dark mode"
      >
        <span role="img" aria-label="moon">
          🌚
        </span>
      </button>
      <button
        onClick={() => setMode("system")}
        className={`p-2 rounded ${mode === "system" ? "bg-blue-100" : ""}`}
        aria-label="System default"
        title="System default"
      >
        <span role="img" aria-label="desktop">
          🖥️
        </span>
      </button>
    </div>
  );
}
