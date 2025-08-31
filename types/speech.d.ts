// mockmate/types/speech.d.ts

declare global {
  interface Window {
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
  }

  interface SpeechRecognition extends EventTarget {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    start: () => void;
    stop: () => void;
    abort: () => void;
    onaudioend: ((event: Event) => void) | null;
    onaudiostart: ((event: Event) => void) | null;
    onend: (() => void) | null;
    onerror: ((event: any) => void) | null;
    onnomatch: ((event: any) => void) | null;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onsoundend: ((event: Event) => void) | null;
    onsoundstart: ((event: Event) => void) | null;
    onspeechend: ((event: Event) => void) | null;
    onspeechstart: ((event: Event) => void) | null;
    onstart: (() => void) | null;
  }

  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
  }
}

export {};
