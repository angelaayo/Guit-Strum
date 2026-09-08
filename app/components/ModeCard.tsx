// app/components/ModeCard.tsx
import React from "react";
import Link from "next/link";
import { GameMode } from "../lib/types";
import { getChordsForMode } from "../lib/chord-queries";

const ModeCard = async ({ mode }: { mode: GameMode }) => {
  const modeChords = await getChordsForMode(mode);
  return (
    <Link
      href={`/play/${mode.id}`}
      className="group flex flex-col justify-between w-72 h-80 rounded-2xl border p-6
                 shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg"
      style={{
        backgroundColor: "var(--color-card-bg)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="flex flex-col gap-2">
        <h4
          className="font-inter text-xs tracking-widest uppercase"
          style={{ color: "var(--color-muted)" }}
        >
          {mode.tagline}
        </h4>
        <h3
          className="font-source-serif text-2xl font-semibold"
          style={{ color: "var(--color-primary)" }}
        >
          {mode.label}
        </h3>
        <p
          className="font-inter text-sm leading-relaxed"
          style={{ color: "var(--color-muted)" }}
        >
          {mode.description}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <span
          className="font-inter text-xs tracking-wide"
          style={{ color: "var(--color-muted)" }}
        >
          {modeChords.length} chords
        </span>
        <span
          className="font-source-serif font-semibold tracking-wide px-4 py-2 rounded-lg border
                     transition-colors group-hover:text-white"
          style={{
            color: "var(--color-primary)",
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-card-bg-harsh)",
          }}
        >
          Select Mode →
        </span>
      </div>
    </Link>
  );
};

export default ModeCard;
