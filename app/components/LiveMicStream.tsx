
"use client";

import { useEffect, useRef, useState } from "react";

export default function LiveMicStream({
  onPrediction,
}: {
  onPrediction: (chord: string) => void;
}) {
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [phase, setPhase] = useState<"countdown" | "listening">("countdown");
  const [countdownValue, setCountdownValue] = useState(3);

  async function startListening() {
    const ws = new WebSocket("ws://127.0.0.1:8000/ws/recognize");
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.detectedChord) {
        onPrediction(data.detectedChord);
      }
    };

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;
    await audioContext.audioWorklet.addModule("/audio-processor.js");

    const source = audioContext.createMediaStreamSource(stream);
    const workletNode = new AudioWorkletNode(audioContext, "pcm-processor");

    workletNode.port.onmessage = (event) => {
      const samples: Float32Array = event.data;
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(samples.buffer as ArrayBuffer);
      }
    };

    source.connect(workletNode);
    setPhase("listening");
  }

  useEffect(() => {
    let cancelled = false;

    async function beginRound() {
      for (let i = 3; i >= 1; i--) {
        if (cancelled) return;
        setCountdownValue(i);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      if (!cancelled) await startListening();
    }

    beginRound();

    return () => {
      cancelled = true;
      wsRef.current?.close();
      audioContextRef.current?.close();
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-2">
      {phase === "countdown" && (
        <p
          className="font-source-serif text-4xl font-semibold"
          style={{ color: "var(--color-primary)" }}
        >
          {countdownValue}
        </p>
      )}
      {phase === "listening" && (
        <p
          className="font-inter text-sm"
          style={{ color: "var(--color-muted)" }}
        >
          Listening...
        </p>
      )}
    </div>
  );
}
