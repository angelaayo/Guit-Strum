import { Chord, GameMode } from "./types";

export const chords: Chord[] = [
  {
    id: "g-major-open",
    name: "G Major",
    family: "G",
    difficulty: "beginner",
    frets: [3, 2, 0, 0, 0, 3],
  },
  {
    id: "a-minor-open",
    name: "A Minor",
    family: "Am",
    difficulty: "beginner",
    frets: [-1, 0, 2, 2, 1, 0],
  },
  {
    id: "bb-major-barre",
    name: "Bb Major",
    family: "Bb",
    difficulty: "intermediate",
    frets: [-1, 1, 3, 3, 3, 1],
    isBarre: true,
    barreFret: 1,
  },
  {
    id: "c-major-open",
    name: "C Major",
    family: "C",
    difficulty: "beginner",
    frets: [-1, 3, 2, 0, 1, 0],
  },
  {
    id: "f-major-barre",
    name: "F Major",
    family: "F",
    difficulty: "advanced",
    frets: [1, 3, 3, 2, 1, 1],
    isBarre: true,
    barreFret: 1,
    barreRange: [0, 5],
  },
  {
    id: "d-minor-open",
    name: "D Minor",
    family: "Dm",
    difficulty: "beginner",
    frets: [-1, -1, 0, 2, 3, 1],
  },
  {
    id: "e-minor-open",
    name: "E Minor",
    family: "Em",
    difficulty: "beginner",
    frets: [0, 2, 2, 0, 0, 0],
  },
  {
    id: "b-diminished",
    name: "B Diminished",
    family: "Bdim",
    difficulty: "advanced",
    frets: [-1, 2, 3, 4, 3, -1],
  },
];

export function getRandomChord(
  pool: Chord[] = chords,
  exclude?: string,
): Chord {
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
    chords: chords.filter((c) => c.difficulty === "beginner"),
  },
  {
    id: "intermediate-advanced",
    label: "Intermediate / Advanced",
    tagline: "Barre chords & tricky shapes",
    description:
      "Push into barre chords and less common voicings. For players ready for a real challenge.",
    chords: chords.filter(
      (c) => c.difficulty === "intermediate" || c.difficulty === "advanced",
    ),
  },
  {
    id: "all",
    label: "All Chords",
    tagline: "The full library, fully random",
    description:
      "No filters — every chord in the library is fair game, from open shapes to barres.",
    chords: chords,
  },
];

export function getModeById(id: string): GameMode | undefined {
  return gameModes.find((m) => m.id === id);
}
