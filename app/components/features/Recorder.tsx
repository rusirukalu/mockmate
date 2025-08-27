"use client";
import React, { useRef, useState } from "react";

type Props = {
  onSave?: (blob: Blob) => void;
};
export default function Recorder({ onSave }: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

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
    chunks.current = [];
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
    </div>
  );
}
