"use client";

import { useEffect, useRef } from "react";

export default function LiveMicStream({
  onPrediction,
}: {
  onPrediction: (chord: string) => void;
}) {
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function startListening() {
      const ws = new WebSocket("ws://127.0.0.1:8000/ws/recognize");
      wsRef.current = ws;

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.detectedChord) onPrediction(data.detectedChord);
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
      console.log("Live sample rate:", audioContext.sampleRate);
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
    }

    startListening();

    return () => {
      cancelled = true;
      wsRef.current?.close();
      audioContextRef.current?.close();
    };
  }, []);

  return (
    <p className="font-inter text-sm" style={{ color: "var(--color-muted)" }}>
      Listening...
    </p>
  );
}
