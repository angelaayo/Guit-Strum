"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import type { Chord } from "@/app/generated/prisma/client";
import ChordDiagram from "@/app/components/ChordDiagram";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
] as const;

// Soft tinted badges that sit on the warm palette.
const difficultyBadge: Record<string, { bg: string; fg: string; label: string }> = {
  beginner: { bg: "#e8efe3", fg: "#5f7555", label: "Beginner" },
  intermediate: { bg: "#f4e7d3", fg: "#99712f", label: "Intermediate" },
  advanced: { bg: "#f4ddd5", fg: "#b0533f", label: "Advanced" },
};

// Render a trailing "b" as a proper flat sign (e.g. Bb -> B♭).
function prettySymbol(family: string): string {
  return family.replace(/b/g, "♭");
}

export default function LibraryGrid({ chords }: { chords: Chord[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const visible = chords.filter((c) => {
    const matchesFilter = filter === "all" || c.difficulty === filter;
    const matchesQuery =
      !q || c.name.toLowerCase().includes(q) || c.family.toLowerCase().includes(q);
    return matchesFilter && matchesQuery;
  });

  return (
    <div className="w-full">
      {/* Controls: segmented filter + count on the left, search on the right */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div
            className="flex gap-1 p-1 rounded-full"
            style={{ backgroundColor: "var(--color-card-bg)" }}
          >
            {FILTERS.map((f) => {
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className="font-inter text-sm px-4 py-1.5 rounded-full transition-all"
                  style={{
                    backgroundColor: active ? "var(--color-bg)" : "transparent",
                    color: active ? "var(--color-string)" : "var(--color-muted)",
                    boxShadow: active ? "0 1px 2px rgba(60,46,34,0.12)" : "none",
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
          <span className="font-inter text-sm" style={{ color: "var(--color-muted)" }}>
            {visible.length} {visible.length === 1 ? "chord" : "chords"}
          </span>
        </div>

        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--color-muted)" }}
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search chords..."
            className="gs-input font-inter text-sm rounded-full border py-2 pl-9 pr-4 w-64 bg-transparent"
            style={{ borderColor: "var(--color-border)", color: "var(--color-string)" }}
          />
        </div>
      </div>

      {/* Chord grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {visible.map((chord, i) => {
          const badge =
            difficultyBadge[chord.difficulty] ?? difficultyBadge.beginner;
          return (
            <Link
              key={chord.id}
              href={`/library/${chord.id}`}
              className="group flex flex-col rounded-2xl border p-5 transition-all hover:-translate-y-1 hover:shadow-md"
              style={{ backgroundColor: "#ffffff", borderColor: "var(--color-border)" }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p
                    className="font-source-serif text-3xl font-semibold leading-none"
                    style={{ color: "var(--color-string)" }}
                  >
                    {prettySymbol(chord.family)}
                  </p>
                  <p
                    className="font-inter text-sm mt-1.5"
                    style={{ color: "var(--color-muted)" }}
                  >
                    {chord.name}
                  </p>
                </div>
                <span
                  className="font-inter text-xs"
                  style={{ color: "var(--color-muted)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="flex justify-center py-3">
                <ChordDiagram chord={chord} className="w-40 h-auto" />
              </div>

              <div
                className="flex items-center justify-between pt-3 border-t"
                style={{ borderColor: "var(--color-border)" }}
              >
                <span
                  className="font-inter text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: badge.bg, color: badge.fg }}
                >
                  {badge.label}
                </span>
                <span
                  className="font-inter text-sm font-medium inline-flex items-center gap-1 transition-all group-hover:gap-2"
                  style={{ color: "var(--color-primary)" }}
                >
                  Practice <span aria-hidden>→</span>
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {visible.length === 0 && (
        <p
          className="font-inter text-sm text-center py-12"
          style={{ color: "var(--color-muted)" }}
        >
          No chords match your search.
        </p>
      )}
    </div>
  );
}
