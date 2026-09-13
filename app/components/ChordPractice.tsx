"use client";

import { useState } from "react";
import type { Chord } from "@/app/generated/prisma/client";
import LiveMicStream from "@/app/components/LiveMicStream";
import { Mic } from "lucide-react";

export default function ChordPractice({ chord }: { chord: Chord }) {
  const [practicing, setPracticing] = useState(false);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "incorrect">(
    "idle",
  );
  const [streak, setStreak] = useState(0);

  function handlePrediction(detected: string) {
    if (detected === chord.family) {
      setFeedback("correct");
      setStreak((s) => s + 1);
    } else {
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
