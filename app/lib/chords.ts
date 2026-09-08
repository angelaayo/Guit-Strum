import { GameMode } from "./types";
import type { Chord } from "@/app/generated/prisma/client";

export function getRandomChord(pool: Chord[], exclude?: string): Chord {
  const options = exclude ? pool.filter((c) => c.id !== exclude) : pool;
  const source = options.length ? options : pool;
  const index = Math.floor(Math.random() * source.length);
  return source[index];
}

export const gameModes: GameMode[] = [
  {
    id: "beginner",
    label: "Beginner",
    tagline: "Open chords & simple rhythms",
    description:
      "Master the basics with fundamental shapes and a relaxed tempo. Perfect for building a foundation.",
    difficulties: ["beginner"],
  },
  {
    id: "intermediate-advanced",
    label: "Intermediate / Advanced",
    tagline: "Barre chords & tricky shapes",
    description:
      "Push into barre chords and less common voicings. For players ready for a real challenge.",
    difficulties: ["intermediate", "advanced"],
  },
  {
    id: "all",
    label: "All Chords",
    tagline: "The full library, fully random",
    description:
      "No filters — every chord in the library is fair game, from open shapes to barres.",
  },
];

export function getModeById(id: string): GameMode | undefined {
  return gameModes.find((m) => m.id === id);
}
