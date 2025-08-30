// app/components/features/Recorder.tsx
"use client";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

// Props: allow parent to pass setAnswer for speech-to-text
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

  // Speech-to-text state
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

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
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Failed to start recording:", error);
      alert("Failed to access camera/microphone. Please check permissions.");
    }
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

  // Simple Speech-to-Text using Web Speech API
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

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
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
    <div className="w-full space-y-4 border rounded-lg p-6 bg-white shadow-sm">
      <div className="flex flex-wrap gap-3">
        {!isRecording ? (
          <Button
            onClick={start}
            variant="default"
            size="default"
            aria-label="Start video and audio recording"
            title="Start recording your interview answer"
          >
            🎥 Start Recording
          </Button>
        ) : (
          <Button
            onClick={stop}
            variant="destructive"
            size="default"
            aria-label="Stop recording"
            title="Stop the current recording"
          >
            ⏹️ Stop Recording
          </Button>
        )}

        <Button
          onClick={reset}
          disabled={!mediaUrl && !isRecording}
          variant="outline"
          size="default"
          aria-label="Reset recorder and clear all content"
          title="Clear recording and transcript data"
        >
          🗑️ Reset
        </Button>
      </div>

      {/* Video playback */}
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

      {/* Speech-to-Text Controls */}
      <div className="border-t pt-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Speech-to-Text Transcription
        </h3>

        <div className="flex flex-wrap gap-3 items-start">
          {!isTranscribing ? (
            <Button
              onClick={startTranscribe}
              variant="secondary"
              size="default"
              aria-label="Start speech-to-text transcription"
              title="Begin converting your speech to text in real-time"
            >
              🎤 Start Transcription
            </Button>
          ) : (
            <Button
              onClick={stopTranscribe}
              variant="outline"
              size="default"
              aria-label="Stop speech-to-text transcription"
              title="Stop the speech recognition process"
            >
              ⏸️ Stop Transcription
            </Button>
          )}

          {isTranscribing && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              Listening...
            </div>
          )}
        </div>

        {/* Transcript Display */}
        {transcript && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
            <label className="text-xs font-medium text-gray-600 block mb-1">
              Transcribed Text:
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
      </div>
    </div>
  );
}
