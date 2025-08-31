// app/components/features/Recorder.tsx
"use client";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  onSave?: (blob: Blob) => void;
  onTranscript?: (transcript: string) => void;
};

export default function Recorder({ onSave, onTranscript }: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // Speech-to-text
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const transcriptRef = useRef<string>(""); // accumulated transcript
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const speechSupported =
    typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  function createRecognition(): SpeechRecognition | null {
    if (!speechSupported) return null;

    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SR) return null;

    const rec: SpeechRecognition = new SR();
    rec.lang = "en-US";
    rec.continuous = true;
    rec.interimResults = true;

    rec.onstart = () => setIsTranscribing(true);

    rec.onresult = (event: SpeechRecognitionEvent) => {
      let delta = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          delta += result[0].transcript + " ";
        }
      }
      if (delta) {
        const merged = (transcriptRef.current + " " + delta).trim();
        transcriptRef.current = merged;
        setTranscript(merged);
        onTranscript?.(merged);
      }
    };

    rec.onerror = () => setIsTranscribing(false);
    rec.onend = () => setIsTranscribing(false);

    return rec;
  }

  async function start() {
    try {
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

      transcriptRef.current = "";
      setTranscript("");

      recorder.start();
      setIsRecording(true);

      if (speechSupported) {
        const rec = createRecognition();
        if (rec) {
          recognitionRef.current = rec;
          try {
            rec.start();
          } catch {
            // ignore double starts
          }
        }
      }
    } catch (error) {
      console.error("Failed to start recording:", error);
      alert("Failed to access camera/microphone. Please check permissions.");
    }
  }

  function stop() {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
  }

  function reset() {
    setMediaUrl(null);
    setIsRecording(false);
    setTranscript("");
    transcriptRef.current = "";
    setIsTranscribing(false);
    chunks.current = [];

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }
  }

  return (
    <div className="w-full space-y-4 border rounded-lg p-6 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800">
          Option 1: Record your answer (auto-transcribes)
        </h3>
        {!speechSupported && (
          <span className="text-xs text-amber-600">
            Note: Speech recognition not supported in this browser.
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {!isRecording ? (
          <Button
            onClick={start}
            variant="default"
            size="default"
            aria-label="Start video and audio recording"
            title="Start recording your interview answer (auto-transcribes)"
          >
            🎥 Start Recording
          </Button>
        ) : (
          <Button
            onClick={stop}
            variant="destructive"
            size="default"
            aria-label="Stop recording"
            title="Stop the current recording (transcription will finalize)"
          >
            ⏹️ Stop Recording
          </Button>
        )}

        <Button
          onClick={reset}
          disabled={!mediaUrl && !isRecording && !transcript}
          variant="outline"
          size="default"
          aria-label="Reset recorder and clear all content"
          title="Clear recording and transcript data"
        >
          🗑️ Reset
        </Button>

        {(isRecording || isTranscribing) && speechSupported && (
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            {isRecording ? "Recording…" : "Processing…"} Auto-transcribing…
          </div>
        )}
      </div>

      {mediaUrl && (
        <div className="mt-4">
          <video
            src={mediaUrl}
            controls
            className="w-full rounded-lg shadow-sm"
            aria-label="Your recorded interview answer - video and audio playback"
            title="Playback of your recorded answer"
          />
        </div>
      )}

      {transcript && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
          <label className="text-xs font-medium text-gray-600 block mb-1">
            Auto-transcribed Text (also placed in “Your Answer”):
          </label>
          <p
            className="text-sm text-gray-800 leading-relaxed"
            aria-label="Transcribed speech content"
            title={transcript}
          >
            {transcript}
          </p>
        </div>
      )}

      <div className="border-t pt-4">
        <h4 className="text-sm font-semibold text-gray-800">
          Option 2: Type your answer instead
        </h4>
        <p className="text-xs text-gray-600">
          You can ignore recording and just type in the “Your Answer” box below.
        </p>
      </div>
    </div>
  );
}
