"use client";

import { useState } from "react";
import Link from "next/link";
import type { Chord } from "@/app/generated/prisma/client";
import ChordDiagram from "@/app/components/ChordDiagram";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
] as const;

const difficultyColor: Record<string, string> = {
  beginner: "var(--color-muted)",
  intermediate: "var(--color-primary-soft)",
  advanced: "var(--color-muted-string)",
};

export default function LibraryGrid({ chords }: { chords: Chord[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");

  const visible =
    filter === "all" ? chords : chords.filter((c) => c.difficulty === filter);

  return (
    <div className="w-full flex flex-col items-center gap-10">
      <div className="flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className="font-inter text-sm px-4 py-2 rounded-full border transition-colors"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor:
                filter === f.id
                  ? "var(--color-primary)"
                  : "var(--color-card-bg)",
              color: filter === f.id ? "var(--color-bg)" : "var(--color-muted)",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-5xl">
        {visible.map((chord) => (
          <Link
            key={chord.id}
            href={`/library/${chord.id}`}
            className="group flex flex-col items-center gap-3 rounded-2xl border p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
            style={{
              backgroundColor: "var(--color-card-bg)",
              borderColor: "var(--color-border)",
            }}
          >
            <ChordDiagram chord={chord} />
            <div className="text-center">
              <p
                className="font-source-serif text-lg font-semibold"
                style={{ color: "var(--color-primary)" }}
              >
                {chord.name}
              </p>
              <span
                className="font-inter text-xs uppercase tracking-wide px-2 py-0.5 rounded-full inline-block mt-1"
                style={{
                  color: difficultyColor[chord.difficulty],
                  border: `1px solid ${difficultyColor[chord.difficulty]}`,
                }}
              >
                {chord.difficulty}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
