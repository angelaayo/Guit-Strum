"use client";

import { useEffect, useState } from "react";
import type { Chord } from "@/app/generated/prisma/client";
import { getRandomChord } from "@/app/lib/chords";
import ChordCard from "@/app/components/ChordCard";
import LiveMicStream from "@/app/components/LiveMicStream";
import GameHeader from "@/app/components/GameHeader";
import GameFooter from "@/app/components/GameFooter";
import { recordAttempt } from "../lib/record-attempt";
import { CORRECT_CONFIDENCE_THRESHOLD, INCORRECT_CONFIDENCE_THRESHOLD } from "../lib/recognition-config";

export default function PlayModeContent({
  modeChords,
}: {
  modeChords: Chord[];
}) {
  const [currentChord, setCurrentChord] = useState<Chord>(() =>
    getRandomChord(modeChords),
  );
  const [score, setScore] = useState(0);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [countdownValue, setCountdownValue] = useState(3);

  useEffect(() => {
    let cancelled = false;

    async function runCountdown() {
      for (let i = 3; i >= 1; i--) {
        if (cancelled) return;
        setCountdownValue(i);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      if (!cancelled) setSessionStarted(true);
    }

    runCountdown();

    return () => {
      cancelled = true;
    };
  }, []); // runs once for the whole session, not per-chord

  function nextChord() {
    setCurrentChord((prev) => getRandomChord(modeChords, prev?.id));
  }

  function handlePrediction(detectedChord: string, confidence: number) {
    const isTarget = detectedChord === currentChord.family;

    if (isTarget && confidence >= CORRECT_CONFIDENCE_THRESHOLD) {
      // confidently correct
      recordAttempt(currentChord.id, true);
      setScore((s) => s + 1);
      nextChord();
    } else if (confidence >= INCORRECT_CONFIDENCE_THRESHOLD) {
      // confident enough to count as a genuine (wrong or too-uncertain) attempt
      recordAttempt(currentChord.id, false);
    }
    // anything below INCORRECT_CONFIDENCE_THRESHOLD never even arrives here —
    // Python already filtered it out as noise
  }

  return (
    <div className="min-h-screen w-full flex flex-col">
      <GameHeader currentScore={score} />
      <main className="flex-1 mt-16">
        <div className="flex">
          <div className="flex-1 flex justify-center">Notes</div>

          <div className="flex-1 flex flex-col items-center gap-4">
            {!sessionStarted ? (
              <div className="border fixed inset-0 flex items-center justify-center">
                <p
                  className="font-source-serif text-9xl font-semibold"
                  style={{ color: "var(--color-primary)" }}
                >
                  {countdownValue}
                </p>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center">
                <ChordCard
                  key={`card-${currentChord.id}`}
                  chord={currentChord}
                />
                <LiveMicStream
                  key={`mic-${currentChord.id}`}
                  onPrediction={handlePrediction}
                />
                <button
                  onClick={nextChord}
                  className="w-fit tracking-widest font-semibold border rounded-sm mt-4 font-source-serif px-8 py-2 shadow-md"
                  style={{
                    color: "var(--color-primary)",
                    backgroundColor: "var(--color-card-bg)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  SKIP
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 flex justify-center">Queue</div>
        </div>
      </main>

      <GameFooter />
    </div>
  );
}
