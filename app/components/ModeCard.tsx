import React from "react";
import { GameMode } from "../lib/types";

const ModeCard = ({ mode }: { mode: GameMode }) => {
  return (
    <div
      className="flex flex-col border p-4 rounded-md gap-2"
      style={{ backgroundColor: "var(--color-card-bg-harsh)", borderColor: "var(--color-border)" }}
    >
      <div>Image</div>
      <h3 className="font-source-serif text-lg font-medium" style={{color: "var(--color-primary)"}}>{mode.label}</h3>
      <h4 className="font-inter text-xs tracking-wide" style={{color: "var(--color-muted)"}}>OPEN CHORDS & SIMPLE RYTHMS</h4>
      <h4>
        Master the basics with fundamental shapes and a relaxed tempo. Perfect
        for establishing a
      </h4>
      <button>Select Mode</button>
    </div>
  );
};

export default ModeCard;
