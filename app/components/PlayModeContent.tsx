"use client";
import { useEffect, useState } from "react";
import type { Chord } from "@/app/generated/prisma/client";
import { getRandomChord } from "@/app/lib/chords";
import ChordCard from "@/app/components/ChordCard";
import LiveMicStream from "@/app/components/LiveMicStream";
import GameHeader from "@/app/components/GameHeader";
import GameFooter from "@/app/components/GameFooter";
import { recordAttempt } from "../lib/record-attempt";
import {
  CORRECT_CONFIDENCE_THRESHOLD,
  INCORRECT_CONFIDENCE_THRESHOLD,
} from "../lib/recognition-config";

const QUEUE_SIZE = 3;

function pickUnique(pool: Chord[], excludeIds: Set<string>): Chord {
  const options = pool.filter((c) => !excludeIds.has(c.id));
  const source = options.length ? options : pool; // fallback if pool is too small to avoid all repeats
  return source[Math.floor(Math.random() * source.length)];
}

function buildQueue(pool: Chord[], currentId: string): Chord[] {
  const used = new Set([currentId]);
  const queue: Chord[] = [];
  for (let i = 0; i < QUEUE_SIZE; i++) {
    const next = pickUnique(pool, used);
    queue.push(next);
    used.add(next.id);
  }
  return queue;
}

export default function PlayModeContent({
  modeChords,
}: {
  modeChords: Chord[];
}) {
  const [game, setGame] = useState(() => {
    const current = getRandomChord(modeChords);
    return { current, queue: buildQueue(modeChords, current.id) };
  });
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
  }, []);

  function nextChord() {
    setGame((prev) => {
      const [next, ...rest] = prev.queue;
      const used = new Set([next.id, ...rest.map((c) => c.id)]);
      const newlyQueued = pickUnique(modeChords, used);
      return { current: next, queue: [...rest, newlyQueued] };
    });
  }

  function handlePrediction(detectedChord: string, confidence: number) {
    const isTarget = detectedChord === game.current.family;

    if (isTarget && confidence >= CORRECT_CONFIDENCE_THRESHOLD) {
      recordAttempt(game.current.id, true);
      setScore((s) => s + 1);
      nextChord();
    } else if (confidence >= INCORRECT_CONFIDENCE_THRESHOLD) {
      recordAttempt(game.current.id, false);
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col">
      <GameHeader currentScore={score} />
      <main className="flex-1 mt-16">
        <div className="flex">
          <div className="flex-1" />

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
                  key={`card-${game.current.id}`}
                  chord={game.current}
                />
                <LiveMicStream
                  key={`mic-${game.current.id}`}
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

          <div className="flex-1 flex flex-col items-center gap-3 pt-8">
            {sessionStarted && (
              <>
                <h3
                  className="font-source-serif font-semibold text-sm uppercase tracking-wide"
                  style={{ color: "var(--color-muted)" }}
                >
                  Up Next
                </h3>
                {game.queue.map((chord, i) => (
                  <div
                    key={chord.id}
                    className="rounded-xl border px-5 py-2 font-source-serif font-semibold"
                    style={{
                      backgroundColor: "var(--color-card-bg)",
                      borderColor: "var(--color-border)",
                      color:
                        i === 0 ? "var(--color-primary)" : "var(--color-muted)",
                      fontSize: i === 0 ? "1.1rem" : "0.95rem",
                      opacity: 1 - i * 0.2,
                    }}
                  >
                    {chord.name}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </main>

      <GameFooter />
    </div>
  );
}
