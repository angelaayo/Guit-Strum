import React from "react";
import { Chord } from "../lib/types";
import ChordDiagram from "./ChordDiagram";

export default function ChordCard({ chord }: { chord: Chord }) {
  return (
    <div
      className="flex flex-col items-center justify-between
                 w-110 h-130 rounded-2xl border
                 px-6 py-8 shadow-md"
      style={{
        backgroundColor: "var(--color-card-bg)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="flex flex-col justify-center items-center gap-2">
        <h2
          className="text-7xl font-bold font-source-serif"
          style={{ color: "var(--color-primary)" }}
        >
          {chord.name[0]}
        </h2>
        <h2
          className="tracking-widest font-source-serif"
          style={{ color: "var(--color-muted)" }}
        >
          {chord.name.slice(1).toUpperCase()}
        </h2>
      </div>

      <ChordDiagram chord={chord} />
    </div>
  );
}
