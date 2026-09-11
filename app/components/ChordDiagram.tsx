import React from "react";
import type { Chord } from "@/app/generated/prisma/client";
import { useSettings } from "@/app/lib/providers";

export default function ChordDiagram({ chord }: { chord: Chord }) {
  const { handedness } = useSettings();
  const { frets, isBarre, barreFret, barreStart, barreEnd } = chord;
  const stringSpacing = 26;
  const fretSpacing = 30;
  const startX = 16;
  const startY = 24; // leave room above for muted/open markers

  const barreStrings = isBarre
    ? frets
        .map((fret, i) => ({ fret, i }))
        .filter(({ fret }) => fret === barreFret)
        .map(({ i }) => i)
    : [];

  // Explicit database values take priority; the fallback supports chords
  // whose barre range was not set in the database.
  const resolvedBarreStart =
    barreStart ?? (barreStrings.length ? Math.min(...barreStrings) : null);
  const resolvedBarreEnd =
    barreEnd ?? (barreStrings.length ? Math.max(...barreStrings) : null);

  // content spans roughly this box — tune viewBox to match, not an arbitrary 200x200
  const contentWidth = startX * 2 + 5 * stringSpacing;
  const contentHeight = startY + 4 * fretSpacing + 12; // +12 bottom breathing room

  return (
    <svg
      viewBox={`0 0 ${contentWidth} ${contentHeight}`}
      className="w-70 h-80"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <g
        style={
          handedness === "left"
            ? { transform: `scaleX(-1) translateX(-${contentWidth}px)` }
            : undefined
        }
      >
        <rect
          x={startX}
          y={startY}
          width={5 * stringSpacing}
          height="4"
          fill="var(--color-string)"
        />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line
            key={i}
            x1={startX + i * stringSpacing}
            y1={startY}
            x2={startX + i * stringSpacing}
            y2={startY + 4 * fretSpacing}
            stroke="var(--color-string)"
            strokeWidth="1"
          />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1={startX}
            y1={startY + i * fretSpacing}
            x2={startX + 5 * stringSpacing}
            y2={startY + i * fretSpacing}
            stroke="var(--color-string)"
            strokeWidth="1"
          />
        ))}
        {resolvedBarreStart !== null && resolvedBarreEnd !== null && (
          <rect
            x={startX + resolvedBarreStart * stringSpacing - 9}
            y={startY + (barreFret! - 0.5) * fretSpacing - 8}
            width={(resolvedBarreEnd - resolvedBarreStart) * stringSpacing + 18}
            height="16"
            rx="8"
            fill="var(--color-dot)"
          />
        )}
        {frets.map((fret, stringIdx) => {
          if (fret <= 0 || barreStrings.includes(stringIdx)) return null;
          return (
            <circle
              key={stringIdx}
              cx={startX + stringIdx * stringSpacing}
              cy={startY + (fret - 0.5) * fretSpacing}
              r="8"
              fill="var(--color-dot)"
            />
          );
        })}
        {frets.map((fret, stringIdx) => {
          if (fret === -1)
            return (
              <text
                key={stringIdx}
                x={startX - 4 + stringIdx * stringSpacing}
                y={startY - 7}
                fontSize="11"
                fill="var(--color-muted-string)"
              >
                ✕
              </text>
            );
          if (fret === 0)
            return (
              <circle
                key={stringIdx}
                cx={startX + stringIdx * stringSpacing}
                cy={startY - 10}
                r="3.5"
                fill="none"
                stroke="var(--color-muted)"
              />
            );
          return null;
        })}
      </g>
    </svg>
  );
}
