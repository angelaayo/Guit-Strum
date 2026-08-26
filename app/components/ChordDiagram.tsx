import React from "react";
import { Chord } from "../lib/types";

export default function ChordDiagram({ chord }: { chord: Chord }) {
  const { frets, fingers, isBarre, barreFret } = chord;
  const stringSpacing = 30;
  const fretSpacing = 35;
  const startX = 20;
  const startY = 20;

  // Figure out which strings are part of the barre (same fret, finger === 1 typically)
  const barreStrings = isBarre
    ? frets
        .map((fret, i) => ({ fret, i }))
        .filter(({ fret }) => fret === barreFret)
        .map(({ i }) => i)
    : [];

  const barreStart = chord.barreRange?.[0] ?? (barreStrings.length ? Math.min(...barreStrings) : null);
const barreEnd = chord.barreRange?.[1] ?? (barreStrings.length ? Math.max(...barreStrings) : null);

  return (
    <svg viewBox="0 0 200 200" className="w-40 h-36 border-2 bg-[#F2EDE6]">
      {/* Nut */}
      <rect
        x={startX}
        y={startY}
        width={5 * stringSpacing}
        height="4"
        fill="black"
      />

      {/* Strings */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <line
          key={i}
          x1={startX + i * stringSpacing}
          y1={startY}
          x2={startX + i * stringSpacing}
          y2={startY + 4 * fretSpacing}
          stroke="black"
          strokeWidth="1"
        />
      ))}

      {/* Frets */}
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1={startX}
          y1={startY + i * fretSpacing}
          x2={startX + 5 * stringSpacing}
          y2={startY + i * fretSpacing}
          stroke="black"
          strokeWidth="1"
        />
      ))}

      {/* Barre bar — draw first so dots layer on top if needed */}
      {barreStart !== null && barreEnd !== null && (
        <rect
          x={startX + barreStart * stringSpacing - 10}
          y={startY + (barreFret! - 0.5) * fretSpacing - 10}
          width={(barreEnd - barreStart) * stringSpacing + 20}
          height="15"
          rx="10"
          fill="currentColor"
        />
      )}

      {/* Individual finger dots — skip strings already covered by the barre */}
      {frets.map((fret, stringIdx) => {
        if (fret <= 0) return null;
        if (barreStrings.includes(stringIdx)) return null; // already drawn as part of barre
        return (
          <circle
            key={stringIdx}
            cx={startX + stringIdx * stringSpacing}
            cy={startY + (fret - 0.5) * fretSpacing}
            r="10"
            fill="currentColor"
          />
        );
      })}

      {/* Muted / open markers above nut */}
      {frets.map((fret, stringIdx) => {
        if (fret === -1)
          return (
            <text
              key={stringIdx}
              x={startX - 4 + stringIdx * stringSpacing}
              y={startY - 6}
              fontSize="12"
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
              r="4"
              fill="none"
              stroke="black"
            />
          );
        return null;
      })}
    </svg>
  );
}
