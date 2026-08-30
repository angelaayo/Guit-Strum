"use client";
import React from "react";
import { Chord, GameMode } from "@/app/lib/types";
import { getModeById, getRandomChord, chords} from "@/app/lib/chords";
import { useState } from "react";
import { notFound } from "next/navigation";
import ChordCard from "@/app/components/ChordCard";
import GameHeader from "@/app/components/GameHeader";
import GameFooter from "@/app/components/GameFooter";
import { use } from "react";

export default function PlayMode({params}: {params: Promise<{modeId: string}>}){
  const {modeId} = use(params);
  const mode = getModeById(modeId);
  if(!mode) return notFound();
  return <PlayModeContent mode ={mode} />
}

function PlayModeContent({mode}: {mode: GameMode}){
  const [currentChord, setCurrentChord] = useState<Chord>(() => getRandomChord(mode.chords));
  function nextChord(){
    setCurrentChord(getRandomChord(mode.chords, currentChord.id))
  }
  return(
<div className="min-h-screen w-full flex flex-col">
      <GameHeader />
      <main className="flex-1 mt-16">
        <div className="flex">
          <div className="flex-1 flex justify-center">Notes</div>

          <div className="flex-1 flex flex-col items-center">
            <ChordCard key={currentChord.id} chord={currentChord} />
            <button
              onClick={nextChord}
              className="tracking-widest font-semibold border rounded-sm mt-4 font-source-serif px-8 py-2 shadow-md"
              style={{
                color: "var(--color-primary)",
                backgroundColor: "var(--color-card-bg)",
                borderColor: "var(--color-border)",
              }}
            >
              SKIP
            </button>
          </div>

          <div className="flex-1 flex justify-center">Queue</div>
        </div>
      </main>

      <GameFooter />
    </div>
  )
}





