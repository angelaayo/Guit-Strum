"use client";

import { useState } from "react";
import type { Chord } from "@/app/generated/prisma/client";
import LiveMicStream from "@/app/components/LiveMicStream";
import { Mic } from "lucide-react";
import { recordAttempt } from "../lib/record-attempt";
import {
  CORRECT_CONFIDENCE_THRESHOLD,
  INCORRECT_CONFIDENCE_THRESHOLD,
} from "../lib/recognition-config";

export default function ChordPractice({ chord }: { chord: Chord }) {
  const [practicing, setPracticing] = useState(false);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "incorrect">(
    "idle",
  );
  const [streak, setStreak] = useState(0);

  function handlePrediction(detectedChord: string, confidence: number) {
    const isTarget = detectedChord === chord.family;

    if (isTarget && confidence >= CORRECT_CONFIDENCE_THRESHOLD) {
      setFeedback("correct");
      setStreak((s) => s + 1);
      recordAttempt(chord.id, true);
    } else if (confidence >= INCORRECT_CONFIDENCE_THRESHOLD) {
      setStreak(0);
      recordAttempt(chord.id, false);
      setFeedback("incorrect");
    }
  }

  if (!practicing) {
    return (
      <button
        onClick={() => {
          setPracticing(true);
          setFeedback("idle");
        }}
        className="gs-button flex items-center gap-2 font-source-serif font-semibold rounded-xl px-5 py-3"
        style={{
          backgroundColor: "var(--color-primary)",
          color: "var(--color-bg)",
        }}
      >
        <Mic size={18} />
        Practice This Chord
      </button>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <LiveMicStream key={chord.id} onPrediction={handlePrediction} />

      {feedback === "correct" && (
        <p
          className="font-source-serif font-semibold"
          style={{ color: "var(--color-primary)" }}
        >
          ✓ Nailed it! {streak > 1 && `(${streak} in a row)`}
        </p>
      )}
      {feedback === "incorrect" && (
        <p
          className="font-inter text-sm"
          style={{ color: "var(--color-muted)" }}
        >
          Not quite — give it another strum.
        </p>
      )}

      <button
        onClick={() => setPracticing(false)}
        className="font-inter text-sm"
        style={{ color: "var(--color-muted)" }}
      >
        Stop practicing
      </button>
    </div>
  );
}
