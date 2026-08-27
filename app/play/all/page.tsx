"use client";
import React from "react";
import { Chord } from "@/app/lib/types";
import { getRandomChord } from "@/app/lib/chords";
import { useState } from "react";
import ChordCard from "@/app/components/ChordCard";
import GameHeader from "@/app/components/GameHeader";
import GameFooter from "@/app/components/GameFooter";

const AllChords = () => {
  const [currentChord, setCurrentChord] = useState<Chord>(() =>
    getRandomChord(),
  );
  function nextChord() {
    setCurrentChord(getRandomChord());
  }
  return (
    <div className="min-h-screen w-full flex flex-col">
      <GameHeader />
      <main className="flex-1 mt-16">
        <div className="flex">
          <div className="flex-1 flex justify-center">Notes</div>

          <div className="flex-1 flex flex-col items-center">
            <ChordCard key={currentChord.id} chord={currentChord} />
            <button className="border mt-4">SKIP</button>
          </div>

          <div className="flex-1 flex justify-center">Queue</div>
        </div>
      </main>

      <GameFooter />
    </div>
  );
};

export default AllChords;
