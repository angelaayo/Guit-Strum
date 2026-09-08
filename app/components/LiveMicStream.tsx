"use client";

import { useEffect, useRef, useState } from "react";

export default function LiveMicStream({
  onPrediction,
}: {
  onPrediction: (chord: string) => void;
}) {
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [status, setStatus] = useState<"connecting" | "listening" | "error">(
    "connecting",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function startListening() {
      setStatus("connecting");
      setErrorMessage("");

      try {
        const ws = new WebSocket("ws://127.0.0.1:8000/ws/recognize");
        wsRef.current = ws;

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.detectedChord) onPrediction(data.detectedChord);
        };

        ws.onerror = () => {
          if (!cancelled) {
            setStatus("error");
            setErrorMessage("Couldn't connect to the recognizer server.");
          }
        };

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
          },
        });
        if (cancelled) return;

        const audioContext = new AudioContext();
        console.log("AudioContext sample rate:", audioContext.sampleRate);
        audioContextRef.current = audioContext;
        await audioContext.audioWorklet.addModule("/audio-processor.js");
        if (cancelled) return;

        const source = audioContext.createMediaStreamSource(stream);
        const workletNode = new AudioWorkletNode(audioContext, "pcm-processor");

        workletNode.port.onmessage = (event) => {
          const samples: Float32Array = event.data;
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(samples.buffer as ArrayBuffer);
          }
        };

        source.connect(workletNode);
        if (!cancelled) setStatus("listening");
      } catch (err) {
        if (cancelled) return;
        setStatus("error");

        if (err instanceof DOMException) {
          if (err.name === "NotFoundError") {
            setErrorMessage("No microphone found. Plug one in and try again.");
          } else if (err.name === "NotAllowedError") {
            setErrorMessage(
              "Microphone access was denied. Click below to allow it.",
            );
          } else {
            setErrorMessage(`Microphone error: ${err.name}`);
          }
        } else {
          setErrorMessage("Something went wrong accessing the microphone.");
        }
      }
    }

    startListening();

    return () => {
      cancelled = true;
      wsRef.current?.close();
      audioContextRef.current?.close();
    };
  }, [attempt]); // re-runs whenever "attempt" changes, i.e. when Retry is clicked

  if (status === "error") {
    return (
      <div className="flex flex-col items-center gap-2">
        <p
          className="font-inter text-sm text-center"
          style={{ color: "var(--color-muted)" }}
        >
          {errorMessage}
        </p>
        <button
          onClick={() => setAttempt((a) => a + 1)}
          className="font-source-serif font-semibold px-4 py-2 rounded-lg border"
          style={{
            color: "var(--color-primary)",
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-card-bg)",
          }}
        >
          Retry Microphone Access
        </button>
      </div>
    );
  }

  return (
    <p className="font-inter text-sm" style={{ color: "var(--color-muted)" }}>
      {status === "connecting" ? "Connecting..." : "Listening..."}
    </p>
  );
}
