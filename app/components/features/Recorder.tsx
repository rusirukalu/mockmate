"use client";
import React, { useRef, useState } from "react";

// Props: allow parent to pass setAnswer for speech-to-text
type Props = {
  onSave?: (blob: Blob) => void;
  onTranscript?: (transcript: string) => void; // NEW!
};
export default function Recorder({ onSave, onTranscript }: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // --- Speech-to-text state ---
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  async function start() {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    streamRef.current = stream;
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => chunks.current.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks.current, { type: "video/webm" });
      setMediaUrl(URL.createObjectURL(blob));
      onSave?.(blob);
      chunks.current = [];
      stream.getTracks().forEach((t) => t.stop());
    };
    mediaRecorderRef.current = recorder;
    recorder.start();
    setIsRecording(true);
  }

  function stop() {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  }

  function reset() {
    setMediaUrl(null);
    setIsRecording(false);
    setTranscript("");
    setIsTranscribing(false);
    chunks.current = [];
  }

  // --- Simple Speech-to-Text using Web Speech API ---
  function startTranscribe() {
    if (
      typeof window === "undefined" ||
      !(window as any).webkitSpeechRecognition
    ) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    setTranscript("");
    setIsTranscribing(true);

    recognition.onresult = (event: any) => {
      const transcriptResult = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join("");
      setTranscript(transcriptResult);
      onTranscript?.(transcriptResult);
      setIsTranscribing(false);
    };
    recognition.onerror = () => {
      setIsTranscribing(false);
    };
    recognitionRef.current = recognition;
    recognition.start();
  }

  function stopTranscribe() {
    recognitionRef.current?.stop();
    setIsTranscribing(false);
  }

  return (
    <div className="w-full max-w-md space-y-4 border p-4 rounded bg-white shadow">
      <div className="flex gap-2">
        {!isRecording && (
          <button onClick={start} className="btn btn-primary">
            Start Recording
          </button>
        )}
        {isRecording && (
          <button onClick={stop} className="btn btn-danger">
            Stop
          </button>
        )}
        <button
          onClick={reset}
          disabled={!mediaUrl && !isRecording}
          className="btn btn-light"
        >
          Reset
        </button>
      </div>
      {mediaUrl && <video src={mediaUrl} controls className="w-full rounded" />}

      {/* --- Speech to Text --- */}
      <div className="flex gap-3">
        {!isTranscribing ? (
          <button
            onClick={startTranscribe}
            className="btn btn-secondary"
            type="button"
          >
            🎤 Transcribe Answer
          </button>
        ) : (
          <button
            onClick={stopTranscribe}
            className="btn btn-light"
            type="button"
          >
            Stop Transcribe
          </button>
        )}
        {transcript && (
          <span className="text-gray-500 truncate w-36" title={transcript}>
            {transcript.slice(0, 40)}
            {transcript.length > 40 ? "..." : ""}
          </span>
        )}
      </div>
    </div>
  );
}
