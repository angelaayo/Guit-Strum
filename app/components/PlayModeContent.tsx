// app/components/PlayModeContent.tsx
"use client";

import { useState } from "react";
import { Chord, GameMode } from "@/app/lib/types";
import { getRandomChord } from "@/app/lib/chords";
import ChordCard from "@/app/components/ChordCard";
import LiveMicStream from "@/app/components/LiveMicStream";
import GameHeader from "@/app/components/GameHeader";
import GameFooter from "@/app/components/GameFooter";

export default function PlayModeContent({ mode }: { mode: GameMode }) {
  const [currentChord, setCurrentChord] = useState<Chord>(() =>
    getRandomChord(mode.chords)
  );
  const [score, setScore] = useState(0);

  function nextChord() {
    setCurrentChord((prev) => getRandomChord(mode.chords, prev?.id));
  }

  function handlePrediction(detectedChord: string) {
    if (detectedChord === currentChord.family) {
      setScore((s) => s + 1);
      nextChord();
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col">
      <GameHeader currentScore={score} />
      <main className="flex-1 mt-16">
        <div className="flex">
          <div className="flex-1 flex justify-center">Notes</div>

          <div className="flex-1 flex flex-col items-center gap-4">
            <ChordCard key={`card-${currentChord.id}`} chord={currentChord} />
            <LiveMicStream key={`mic-${currentChord.id}`} onPrediction={handlePrediction} />
            <p className="font-inter text-sm" style={{ color: "var(--color-muted)" }}>
              Score: {score}
            </p>
          </div>

          <div className="flex-1 flex justify-center">Queue</div>
        </div>
      </main>

      <GameFooter />
    </div>
  );
}